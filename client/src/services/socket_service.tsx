class SocketService {
    private socket: WebSocket|null = null;
    private onMessageCallback: ((payload: string)=> void )| null = null
    connect() {
        if(this.socket){
            return ;
        }

        const ws = new WebSocket(`ws://localhost:3000?`);

        this.socket = ws

        ws.onmessage = (event) => {
            console.log('this is the event sent', event.data)
            if(this.onMessageCallback){
                this.onMessageCallback(event.data)
            }

        }

    }

    onMessageRegister(callback: (payload: string)=> void){
        this.onMessageCallback  = callback;
    }


}

export const socketService = new SocketService();