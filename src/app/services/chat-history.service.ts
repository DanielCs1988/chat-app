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

  private fetchMessagesHistory() {
    this.http.get<Message[]>('/messages').subscribe(messages => {
        this.publicMessages = messages;
      }
    );
  }

  async fetchPrivateMessageHistory(userId: number): Promise<Message[]> {
    if (this.privateMessages.has(userId)) {
      return this.privateMessages.get(userId);
    }
    const messages = await this.http.get<Message[]>(`/messages/target/${userId}`).toPromise();
    this.privateMessages.set(userId, messages);
    return messages;
  }

  private subscribeToNewMessages() {
    // Here we should subscribe to real-time updates from the chat service emitters
  }

  private async fetchRoomMessages(room: string): Promise<Message[]> {
    // If we want to fetch room messages only when joining a room
    // We both have to save the messages to the cache and return a Promise for the caller (chat) component
  }
}
