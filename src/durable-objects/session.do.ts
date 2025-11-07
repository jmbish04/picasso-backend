import type { Env } from '@/lib/env';
import type { WsEnvelope } from '@/lib/ws-events';

interface Connection {
  ws: WebSocket;
}

/**
 * PicassoDurableObject acts as a stateful actor managing WebSocket clients for a given sessionId.
 * Agents should POST to `/_actor/:sessionId` with a WsEnvelope to fan-out events.
 * Event types include: queued | running | progress | judge | fail | complete.
 */
export class PicassoDurableObject {
  #env: Env;
  #state: DurableObjectState;
  #connections = new Set<Connection>();

  constructor(state: DurableObjectState, env: Env) {
    this.#state = state;
    this.#env = env;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.pathname === '/ws' && request.headers.get('Upgrade') === 'websocket') {
      const { 0: client, 1: server } = new WebSocketPair();
      this.#handleWebSocket(server);
      return new Response(null, { status: 101, webSocket: client });
    }

    if (request.method === 'POST' && url.pathname.startsWith('/_actor/')) {
      const sessionId = url.pathname.split('/').pop();
      if (!sessionId) {
        return new Response('Missing sessionId', { status: 400 });
      }
      const envelope = (await request.json()) as WsEnvelope;
      // TODO(Jules): validate sessionId matches envelope.sessionId and persist optional history.
      this.#broadcast(envelope);
      return new Response(null, { status: 202 });
    }

    return new Response('Not found', { status: 404 });
  }

  #handleWebSocket(ws: WebSocket) {
    ws.accept();
    const connection: Connection = { ws };
    this.#connections.add(connection);

    ws.addEventListener('message', (event) => {
      // TODO(Jules): optionally handle ping/pong or client ack messages.
      event;
    });

    ws.addEventListener('close', () => {
      this.#connections.delete(connection);
    });
  }

  #broadcast(envelope: WsEnvelope) {
    const payload = JSON.stringify(envelope);
    for (const connection of this.#connections) {
      try {
        connection.ws.send(payload);
      } catch (error) {
        console.error('WS broadcast error', error);
        connection.ws.close(1011, 'broadcast-failed');
        this.#connections.delete(connection);
      }
    }
  }
}

// TODO(Jules): add alarm-based cleanup for stale sessions and persistence of last-known state.
