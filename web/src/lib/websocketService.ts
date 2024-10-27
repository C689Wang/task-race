// lib/websocketService.ts
class WebSocketService {
  private static instance: WebSocketService;
  public socket: WebSocket | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(url: string): void {
    if (this.socket) return; // Already connected

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    this.socket.onmessage = event => {
      console.log('Received message:', event.data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.socket = null;
    };
  }

  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open.');
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default WebSocketService;
