import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_CONFIG } from "@/config/apiConfig";

type Handler = (event: unknown) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Record<string, { unsubscribe: () => void }> = {};
  private isConnected = false;
  private reconnectDelay = 3000;
  private subscriberId: string | null = null;
  private activeSubscriptionOwner: string | null = null;
  private handlers = {
    onOrderUpdate: [] as Handler[],
    onTableUpdate: [] as Handler[],
    onKitchenUpdate: [] as Handler[],
  };

  private getWsBaseUrl() {
    return `${API_CONFIG.BASE_URL.replace(/\/$/, "")}/ws`;
  }

  connect(ownerId: string | number, handlers: Partial<typeof this.handlers> = {}) {
    const topicOwnerId = String(ownerId);
    if (!topicOwnerId) return;

    (Object.keys(handlers) as (keyof typeof this.handlers)[]).forEach((key) => {
      handlers[key]?.forEach((h) => this.addHandler(key, h));
    });

    this.subscriberId = topicOwnerId;
    if (this.isConnected && this.activeSubscriptionOwner === topicOwnerId) return;
    if (this.client) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(this.getWsBaseUrl()) as WebSocket,
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.isConnected = true;
        this.activeSubscriptionOwner = this.subscriberId;
        this.subscribeToTopics(this.subscriberId!);
      },
      onDisconnect: () => {
        this.isConnected = false;
        this.activeSubscriptionOwner = null;
        this.subscriptions = {};
      },
    });

    this.client.activate();
  }

  addHandler(type: keyof typeof this.handlers, callback: Handler) {
    if (!this.handlers[type].includes(callback)) {
      this.handlers[type].push(callback);
    }
  }

  removeHandler(type: keyof typeof this.handlers, callback: Handler) {
    this.handlers[type] = this.handlers[type].filter((cb) => cb !== callback);
  }

  private notify(type: keyof typeof this.handlers, event: unknown) {
    this.handlers[type].forEach((cb) => {
      try {
        cb(event);
      } catch (e) {
        console.error(`[WebSocket] ${type} handler error`, e);
      }
    });
  }

  private subscribeToTopics(subscriberId: string) {
    if (!this.client?.connected) return;

    const topics = [
      { dest: `/topic/orders/${subscriberId}`, type: "onOrderUpdate" as const },
      { dest: `/topic/tables/${subscriberId}`, type: "onTableUpdate" as const },
      { dest: `/topic/kitchen/${subscriberId}`, type: "onKitchenUpdate" as const },
    ];

    topics.forEach(({ dest, type }) => {
      if (!this.subscriptions[dest]) {
        this.subscriptions[dest] = this.client!.subscribe(dest, (message: IMessage) => {
          try {
            this.notify(type, JSON.parse(message.body));
          } catch (e) {
            console.error("[WebSocket] parse error", e);
          }
        });
      }
    });
  }

  disconnect() {
    Object.values(this.subscriptions).forEach((s) => s.unsubscribe());
    this.subscriptions = {};
    this.handlers = { onOrderUpdate: [], onTableUpdate: [], onKitchenUpdate: [] };
    this.client?.deactivate();
    this.client = null;
    this.isConnected = false;
    this.subscriberId = null;
    this.activeSubscriptionOwner = null;
  }

  getIsConnected() {
    return this.isConnected;
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
