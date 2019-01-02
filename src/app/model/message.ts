export class Message {
    constructor(public ChatId: number,
        public MessageText: string,
        public SenderName: string,
        public ListUserReceiver?: string[]) {
    }
} ``