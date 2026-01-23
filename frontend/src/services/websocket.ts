/**
 * WebSocket客户端 - 实时排行榜更新
 */
import { ElNotification } from 'element-plus';

type MessageHandler = (data: any) => void;
type ConnectionHandler = () => void;

interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
  timestamp?: number;
}

export class LeaderboardWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimer: number | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private onConnectHandlers: Set<ConnectionHandler> = new Set();
  private onDisconnectHandlers: Set<ConnectionHandler> = new Set();

  constructor(url: string) {
    this.url = url;
  }

  /**
   * 连接WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket已连接');
        this.reconnectAttempts = 0;
        this.onConnectHandlers.forEach(handler => handler());

        // 发送ping测试连接
        this.send({ type: 'ping', timestamp: Date.now() });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('WebSocket消息解析失败:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket连接关闭');
        this.onDisconnectHandlers.forEach(handler => handler());
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('WebSocket连接失败:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 发送消息
   */
  send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * 订阅消息类型
   */
  on(messageType: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set());
    }
    this.messageHandlers.get(messageType)!.add(handler);

    // 返回取消订阅函数
    return () => {
      const handlers = this.messageHandlers.get(messageType);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  /**
   * 订阅连接事件
   */
  onConnect(handler: ConnectionHandler): () => void {
    this.onConnectHandlers.add(handler);
    return () => this.onConnectHandlers.delete(handler);
  }

  /**
   * 订阅断开事件
   */
  onDisconnect(handler: ConnectionHandler): () => void {
    this.onDisconnectHandlers.add(handler);
    return () => this.onDisconnectHandlers.delete(handler);
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(message: WebSocketMessage): void {
    const { type, data } = message;

    // 调用该类型的所有处理器
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('WebSocket重连次数已达上限');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`${delay}ms后尝试第${this.reconnectAttempts}次重连...`);

    this.reconnectTimer = window.setTimeout(() => {
      this.connect();
    }, delay);
  }
}

// 创建全局WebSocket客户端实例
// 开发环境使用相对路径通过Vite代理，生产环境使用绝对路径
const WS_URL = import.meta.env.DEV
  ? `ws://${window.location.hostname}:8000/ws/leaderboard`
  : `ws://${window.location.hostname}/ws/leaderboard`;
export const leaderboardWS = new LeaderboardWebSocket(WS_URL);

// 自动连接
leaderboardWS.on('leaderboard_update', (data: any) => {
  console.log('排行榜更新:', data);

  // 显示通知
  ElNotification({
    title: '新纪录!',
    message: `${data.player_name} 获得 ${data.score} 分`,
    type: 'info',
    duration: 3000,
  });
});

leaderboardWS.on('connected', (data: any) => {
  console.log(data.message);
});

leaderboardWS.on('pong', (data: any) => {
  console.log('Pong:', data);
});
