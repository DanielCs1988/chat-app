import {EventEmitter, Injectable} from '@angular/core';
import {Message} from '../chat/message.model';
import {UserDTO} from '../models/userdto.model';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ChatHistoryService {

  publicMessages: Message[] = [];
  privateMessages = new Map<UserDTO, Message[]>();
  roomMessages = new Map<string, Message[]>();

  publicMessagesFetched = new EventEmitter<Message[]>();
  privateMessagesFetched = new EventEmitter<Map<UserDTO, Message[]>>();

  constructor(private http: HttpClient) {
    this.fetchMessagesHistory();
    this.subscribeToNewMessages();
  }

  private fetchMessagesHistory() {
    // Call the API to populate public and private, possibly room messages too
    this.http.get<Message[]>('/messages').subscribe(messages => {
        this.publicMessages = messages;
        this.publicMessagesFetched.emit(messages);
      }
    );
  }

  private fetchPrivateMessageHistory(userId: number) {
    this.http.get<Map<UserDTO, Message[]>>('/messages/target/:userId').subscribe(messages => {
        this.privateMessages = messages;
        this.privateMessagesFetched.emit(messages);
      }
    );
  }

  private subscribeToNewMessages() {
    // Here we should subscribe to real-time updates from the chat service emitters
  }

  private async fetchRoomMessages(room: string): Promise<Message[]> {
    // If we want to fetch room messages only when joining a room
    // We both have to save the messages to the cache and return a Promise for the caller (chat) component
  }
}
