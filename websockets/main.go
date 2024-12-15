package main

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"math/rand"
	"net"
	"net/http"
	"os"
	"sync"

	"task-race/db"

	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
	"github.com/google/uuid"
)

type RaceEvent struct {
	Action       string
	Origin       string
	Target       *string
	Race         *string
	WinningPhoto *string
	Prompt       string
}

type Server struct {
	client 		*db.PrismaClient
	hub 		Hub
	clientHub	map[string]*Client
	playerToClient map[string]*string
	prompts     []string
	promptLock  sync.Mutex
	clientHubLock sync.Mutex
	playerToClientLock sync.Mutex
}

func main() {
	server, err := NewServer("prompts.txt")
	if err != nil {
		log.Fatalf("Error initializing server: %v", err)
	}
	http.HandleFunc("/handler", server.websocketHandler)
	log.Println("Server started on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}

func NewServer(promptFile string) (*Server, error) {
	// Load prompts from file
	prompts, err := loadPrompts(promptFile)
	if err != nil {
		return nil, err
	}

	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return nil, fmt.Errorf("error connecting to database: %v", err)
	}

	return &Server{
		client:  client,
		prompts: prompts,
		hub: *NewHub(),
		clientHub: make(map[string]*Client),
		playerToClient: make(map[string]*string),
	}, nil
}

func loadPrompts(promptFile string) ([]string, error) {
	file, err := os.Open(promptFile)
	if err != nil {
		return nil, fmt.Errorf("error opening prompts file: %v", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var prompts []string
	for scanner.Scan() {
		prompts = append(prompts, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("error reading prompts: %v", err)
	}
	return prompts, nil
}

func (s *Server) getPrompt() (string) {
	s.promptLock.Lock()
	defer s.promptLock.Unlock()
	randomIndex := rand.Intn(len(s.prompts))
	randomPrompt := s.prompts[randomIndex]
	return randomPrompt
}

func (s *Server) websocketHandler(rw http.ResponseWriter, req *http.Request) {
	conn, _, _, err := ws.UpgradeHTTP(req, rw)
	if err != nil {
		log.Println("Error with WebSocket upgrade:", err)
		http.Error(rw, "WebSocket upgrade failed", http.StatusMethodNotAllowed)
		return
	}

	ctx := context.Background()

	go s.listenForMessages(conn, ctx)
}

func (s *Server) addNewClient(clientId string, conn net.Conn) {
	s.clientHubLock.Lock()
	defer s.clientHubLock.Unlock()
	s.clientHub[clientId] = &Client{conn: &conn}
}

func (s *Server) addNewPlayerToClient(playerId string, clientId string) {
	s.playerToClientLock.Lock()
	defer s.playerToClientLock.Unlock()
	s.playerToClient[playerId] = &clientId
}

func (s *Server) listenForMessages(conn net.Conn, ctx context.Context) {
	clientId := uuid.New().String()
	defer s.handleDeleteResources(clientId)
	defer conn.Close()

	s.addNewClient(clientId, conn)

	for {
		msg, _, err := wsutil.ReadClientData(conn)
		if err != nil {
			log.Println("Error reading WebSocket data:", err)
			return
		}

		var raceEvent RaceEvent
		if err := json.Unmarshal(msg, &raceEvent); err != nil {
			log.Println("Error unmarshalling WebSocket message:", err)
			continue
		}
		go s.handleRaceAction(conn, ctx, raceEvent, clientId)
	}
}

func (s *Server) handleDeleteResources(clientId string) {
	if _, ok := s.clientHub[clientId]; !ok {
		return
	}
	raceId := s.clientHub[clientId].raceId
	if raceId != nil {
		s.hub.DeleteRace(raceId)
	}
	delete(s.clientHub, clientId)
}

func (s *Server) handleRaceAction(conn net.Conn, ctx context.Context, raceEvent RaceEvent, clientId string) {
	switch raceEvent.Action {
	case "player_join":
		s.handlePlayerJoin(conn, ctx, raceEvent, clientId)
	case "initiate_request":
		s.initiateRequest(conn, ctx, raceEvent, clientId)
	case "join_race":
		s.handleJoinRace(conn, ctx, raceEvent, clientId)
	case "submission":
		s.handleSubmission(ctx, raceEvent)
	case "leave_race":
		s.handleLeaveRace(raceEvent)
	default:
		log.Println("Unhandled action:", raceEvent.Action)
	}
}

func (s *Server) handlePlayerJoin(conn net.Conn, ctx context.Context, raceEvent RaceEvent, clientId string) {
	player, err := s.client.Player.FindFirst(
		db.Player.ID.Equals(raceEvent.Origin),
	).Exec(ctx)

	if errors.Is(err, db.ErrNotFound) {
		log.Printf("Player not found")
	} else if err != nil {
		log.Printf("Error finding player: %s", err)
	} else {
		s.addNewPlayerToClient(raceEvent.Origin, clientId)
		s.sendMessage(conn, RaceEvent{
			Action: "player_connected",
			Origin: player.ID,
		})
	}
}

func (s *Server) initiateRequest(conn net.Conn, ctx context.Context, raceEvent RaceEvent, clientId string) {
	player, err := s.client.Player.FindFirst(
		db.Player.ID.Equals(*raceEvent.Target),
	).Exec(ctx)

	if errors.Is(err, db.ErrNotFound) {
		log.Printf("Opponent not found")
	} else if err != nil {
		log.Printf("Error finding opponent: %s", err)
	} else {
		race, err := s.client.Race.CreateOne(
			db.Race.PlayerOne.Link(
				db.Player.ID.Equals(raceEvent.Origin),
			),
			db.Race.PlayerTwo.Link(
				db.Player.ID.Equals(*raceEvent.Target),
			),
		).Exec(ctx)

		if err != nil {
			log.Println("Error creating race")
			return
		}

		s.hub.CreateStoredRace(race.ID, raceEvent.Origin, &conn, raceEvent)

		s.clientHub[clientId].raceId = &race.ID

		s.sendMessage(conn, RaceEvent{
			Action: "race_created",
			Origin: raceEvent.Origin,
			Target: &player.ID,
			Race: &race.ID,
		})
		var opponentClientId *string
		var ok bool
		if opponentClientId, ok = s.playerToClient[player.ID]; !ok {
			return
		}
		var opponentClient *Client
		if opponentClient, ok = s.clientHub[*opponentClientId]; !ok {
			return
		}
		s.sendMessage(*opponentClient.conn, RaceEvent{
			Action: "race_sent",
			Origin: raceEvent.Origin,
			Target: &player.ID,
			Race: &race.ID,
		})
	}
}

func (s *Server) handleJoinRace(conn net.Conn, ctx context.Context, raceEvent RaceEvent, clientId string) {
	player, err := s.client.Player.FindFirst(
		db.Player.ID.Equals(raceEvent.Origin),
	).Exec(ctx)

	race, err2 := s.client.Race.FindUnique(
		db.Race.ID.Equals(*raceEvent.Race),
	).Exec(ctx)

	if errors.Is(err, db.ErrNotFound) {
		log.Printf("player not found")
	} else if  errors.Is(err2, db.ErrNotFound)  {
		log.Printf("race not found")
	 } else if err != nil {
		log.Printf("Error finding race or player: %s", err)
	} else {
		s.clientHub[clientId].raceId = raceEvent.Race
		s.hub.JoinStoredRace(*raceEvent.Race, raceEvent.Origin, &conn, raceEvent)
		prompt := s.getPrompt()
		s.hub.Broadcast(*raceEvent.Race, RaceEvent{
			Action: "race_started",
			Origin: raceEvent.Origin,
			Target: &player.ID,
			Race: &race.ID,
			Prompt: prompt,
		} )
	}
}

func (s *Server) handleSubmission(ctx context.Context, raceEvent RaceEvent) {
	race, err := s.client.Race.FindFirst(
		db.Race.ID.Equals(*raceEvent.Race),
	).Exec(ctx)
	if err != nil {
		log.Println("Error fetching race:", err)
		return
	}
	var winner db.WinnerEnum
	winner = "PLAYER1"
	if race.PlayerTwoID == raceEvent.Origin {
		winner = "PLAYER2"
	}

	_, err = s.client.Race.FindUnique(
		db.Race.ID.Equals(*raceEvent.Race),
	).Update(
		db.Race.WinningPhoto.Set(*raceEvent.WinningPhoto),
		db.Race.Winner.Set(winner),
	).Exec(ctx)

	if err != nil {
		log.Println("Error updating race with winner:", err)
	}

	_, err = s.client.Player.FindUnique(
		db.Player.ID.Equals(raceEvent.Origin),
	).Update(
		db.Player.Score.Increment(1),
	).Exec(ctx)

	if err != nil {
		log.Println("Error updating player score:", err)
	}

	s.hub.Broadcast(*raceEvent.Race, RaceEvent{
		Origin: raceEvent.Origin,
		Target: raceEvent.Target,
		Race: raceEvent.Race,
		WinningPhoto: raceEvent.WinningPhoto,
	})
}

func (s *Server) handleLeaveRace(raceEvent RaceEvent) {
	raceId := s.clientHub[*raceEvent.Race].raceId
	if raceId != nil {
		s.hub.DeleteRace(raceId)
	}
}

func (s *Server) sendMessage(conn net.Conn, message RaceEvent) {
	msg, err := json.Marshal(message)
	if err != nil {
		log.Println("Error marshalling message:", err)
		return
	}

	err = wsutil.WriteServerMessage(conn, ws.OpText, msg)
	if err != nil {
		log.Println("Error sending message:", err)
	}
}