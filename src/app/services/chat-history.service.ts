import {Injectable} from '@angular/core';
import {Message} from '../chat/message.model';
import {HttpClient} from '@angular/common/http';
import {ChatService} from './chat.service';

@Injectable()
export class ChatHistoryService {

  private MESSAGES_URL = '/api/messages';

  publicMessages: Message[] = [];
  privateMessages = new Map<number, Message[]>();
  roomMessages = new Map<string, Message[]>();

  constructor(private http: HttpClient, private chatService: ChatService) {
  }

  initMessageService() {
    this.subscribeToNewMessages();
  }

  public async fetchMessagesHistory(): Promise<Message[]> {
    this.publicMessages = await this.http.get<Message[]>(this.MESSAGES_URL).toPromise();
    return this.publicMessages;
  }

  public async fetchPrivateMessageHistory(userId: number): Promise<Message[]> {
    if (this.privateMessages.has(userId)) {
      return this.privateMessages.get(userId);
    }
    const messages = await this.http.get<Message[]>(`${this.MESSAGES_URL}?target=${userId}&type=USER`).toPromise();
    this.privateMessages.set(userId, messages);
    return messages;
  }

  public async fetchRoomMessages(room: string): Promise<Message[]> {
    if (this.roomMessages.has(room)) {
      return this.roomMessages.get(room);
    }
    const messages = await this.http.get<Message[]>(`${this.MESSAGES_URL}?target=${room}&type=ROOM`).toPromise();
    this.roomMessages.set(room, messages);
    return messages;
  }

    private subscribeToNewMessages() {
      this.chatService.onMessage.subscribe(message => {
        this.publicMessages.push(message);
      });
      this.chatService.onRoomChat.subscribe((room, message) =>
        this.roomMessages.has(room) ? this.roomMessages.get(room).push(message) : this.roomMessages.set(room, message));
      this.chatService.onPrivateMsg.subscribe((target, message) => {
        this.privateMessages.has(target) ? this.privateMessages.get(target).push(message) : this.privateMessages.set(target, message);
      });
  }

}
