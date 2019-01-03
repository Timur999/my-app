import { Message } from './message';

export class Chat {
    Id: number;
    ChatName: string;
    ChatAdminId: string;
    UsersInChat: string[];
  //  messages: Message[];

  constructor(chatName: string, chatAdminId: string, usersInChat: string[]){
      this.ChatName = chatName;
      this.ChatAdminId = chatAdminId;
      this.UsersInChat = usersInChat;
  }
}