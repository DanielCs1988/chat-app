import {EventEmitter, Injectable} from '@angular/core';
import {Message} from '../chat/message.model';
import {HttpClient} from '@angular/common/http';
import {ChatService} from './chat.service';

@Injectable()
export class ChatHistoryService {

  publicMessages: Message[] = [];
  privateMessages = new Map<number, Message[]>();
  roomMessages = new Map<string, Message[]>();

  constructor(private http: HttpClient, private chatService: ChatService) {
    this.fetchMessagesHistory();
    this.subscribeToNewMessages();
  }

  public fetchMessagesHistory() {
    this.http.get<Message[]>('/get-message').subscribe(messages => {
        this.publicMessages = messages;
      }
    );
  }

  public async fetchPrivateMessageHistory(userId: number): Promise<Message[]> {
    if (this.privateMessages.has(userId)) {
      return this.privateMessages.get(userId);
    }
    const messages = await this.http.get<Message[]>(`/get-message?target=${userId}&type=USER`).toPromise();
    this.privateMessages.set(userId, messages);
    return messages;
  }

  public async fetchRoomMessages(room: string): Promise<Message[]> {
    // If we want to fetch room messages only when joining a room
    // We both have to save the messages to the cache and return a Promise for the caller (chat) component
    if (this.roomMessages.has(room)) {
      return this.roomMessages.get(room);
    }
    const messages = await this.http.get<Message[]>(`/get-message?target=${room}&type=ROOM`).toPromise();
    this.roomMessages.set(room, messages);
    return messages;
  }

    private subscribeToNewMessages() {
    // Here we should subscribe to real-time updates from the chat service emitters
      this.chatService.onMessage.subscribe(message => {
        this.publicMessages.push(message);
      });
      this.chatService.onRoomChat.subscribe((room, message) =>
        this.roomMessages.set(room, message));
  }

}
