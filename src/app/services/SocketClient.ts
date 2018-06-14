export class SocketClient {

    private static SEPARATOR = '&';
    private socket: WebSocket;
    private routes = new Map<string, Function>();
    private onOpenHandler: Function;
    private onCloseHandler: Function;
    private cache: Transaction[] = [];
    private isOpen = false;
    private isClosed = false;

    constructor() {
        setInterval(() => {
            if (this.isOpen && this.cache.length > 0) {
                const transaction = this.cache.shift();
                this.send(transaction.route, transaction.payload, transaction.callback);
            }
        }, 100);
    }

    connect(url: string) {
        if (this.isOpen) return;
        this.socket = new WebSocket(url);
        this.socket.addEventListener('open', (ev) => this.onOpenConnection(ev));
        this.socket.addEventListener('close', (ev) => this.onClosedConnection(ev, url));
        this.socket.addEventListener('message', event => this.processMessage(event.data));
    }

    disconnect() {
        if (this.socket) {
            this.isClosed = true;
            this.cache = [];
            this.socket.close();
        }
    }

    private onOpenConnection(event: any) {
        this.isOpen = true;
        if (this.onOpenHandler) this.onOpenHandler.call(null, event);
    }

    private onClosedConnection(event: any, url: string) {
        this.isOpen = false;
        if (this.onCloseHandler) this.onCloseHandler.call(null, event);
        if (this.isClosed) { return; }
        setTimeout(() => {
            this.connect(url);
        }, 10000);
    }

    isConnected(): boolean {
        return this.isOpen;
    }

    on(route: string, callback: Function) {
        switch (route) {
            case 'open':
                this.onOpenHandler = callback;
                break;
            case 'close':
                this.onCloseHandler = callback;
                break;
            default:
                this.routes.set(route, callback);
        }
    }

    send(route: string, payload: any, callback?: Function) {
        if (!this.isOpen) {
          this.cacheMessage(route, payload, callback);
          return;
        }
        if (callback) {
            this.routes.set(route, callback);
        }
        const content = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const message = route + SocketClient.SEPARATOR + content;
        this.socket.send(message);
    }

    private cacheMessage(route: string, payload: any, callback: Function) {
        const transaction: Transaction = {
            route: route,
            payload: payload,
            callback: callback
        };
        this.cache.push(transaction);
    }

    private processMessage(raw: string) {
        const fullMsg = raw.split(SocketClient.SEPARATOR, 2);
        this.handleMessages(fullMsg[0], fullMsg[1]);
    }

    private handleMessages(route: string, payload: string) {
        const handler = this.routes.get(route);
        if (handler != undefined) {
            const object = JSON.parse(payload);
            handler.call(null, object);
        } else {
            console.error(`Received message with no corresponding handler:\nRoute: ${route}\nPayload: ${payload}`);
        }
    }
}

interface Transaction {
    route: string,
    payload: any,
    callback?: Function
}
