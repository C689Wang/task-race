package main

import (
	"encoding/json"
	"log"
	"net"
	"sync"

	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
)


type StoredRace struct {
	clients map[string]*Client
	raceEvent RaceEvent
}

type Hub struct {
	hub map[string]*StoredRace
	hubLock  sync.Mutex
}

func NewHub() *Hub {
	hub := new(Hub)
	hub.hub = make(map[string]*StoredRace)
	return hub
}

func (h *Hub) GetStoredRace(id string) (*StoredRace, bool) {
	h.hubLock.Lock()
	defer h.hubLock.Unlock()
	storedRace, exists := h.hub[id]
	return storedRace, exists
}

func (h *Hub) CreateStoredRace(raceId string, playerId string, conn *net.Conn, raceEvent RaceEvent) {
	h.hubLock.Lock()
	defer h.hubLock.Unlock()
	clients := make(map[string]*Client)
	h.hub[raceId] = &StoredRace{clients: clients, raceEvent: raceEvent}
	storedRace := h.hub[raceId]
	storedRace.clients[playerId] = &Client{conn: conn}
}

func (h *Hub) JoinStoredRace(raceId string, playerId string, conn *net.Conn, raceEvent RaceEvent) {
	h.hubLock.Lock()
	defer h.hubLock.Unlock()
	if _, ok := h.hub[raceId]; !ok {
		return
	}
	h.hub[raceId].clients[playerId] = &Client{conn: conn}
}

func (h *Hub) Broadcast(raceId string, raceEvent RaceEvent) {
	msg, err := json.Marshal(raceEvent)
	if err != nil {
		log.Println("Error marshalling message:", err)
		return
	}
	for _, client := range h.hub[raceId].clients {
		err := wsutil.WriteServerMessage(*client.conn, ws.OpText, msg)
		if err != nil {
			log.Println("Error sending message:", err)
		}
	}
}

func (h *Hub) DeleteRace(raceId *string) {
	h.hubLock.Lock()
	defer h.hubLock.Unlock()
	h.Broadcast(*raceId, RaceEvent{
		Action: "player_left",
	})
	delete(h.hub, *raceId)
}
