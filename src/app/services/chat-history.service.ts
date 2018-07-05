import { Injectable } from '@angular/core';
import {Message} from '../chat/message.model';
import {UserDTO} from '../models/userdto.model';
import {HttpClientModule} from '@angular/common/http';

@Injectable()
export class ChatHistoryService {

  publicMessages: Message[] = [];
  privateMessages = new Map<UserDTO, Message[]>();
  roomMessages = new Map<string, Message[]>();

  constructor(private http: HttpClientModule) {
    this.fetchHistory();
    this.subscribeToNewMessages();
  }

  private fetchHistory() {
    // Call the API to populate public and private, possibly room messages too
  }

  private subscribeToNewMessages() {
    // Here we should subscribe to real-time updates from the chat service emitters
  }

  private async fetchRoomMessages(room: string): Promise<Message[]> {
    // If we want to fetch room messages only when joining a room
    // We both have to save the messages to the cache and return a Promise for the caller (chat) component
  }
}
