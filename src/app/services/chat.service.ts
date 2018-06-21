import {EventEmitter, Injectable} from '@angular/core';
import {SocketClient} from './SocketClient';
import {Router} from '@angular/router';
import {Message} from '../chat/message.model';
import {AuthService} from './auth.service';

@Injectable()
export class ChatService {

  private domain = 'localhost';
  private port = 8080;

  onMessage = new EventEmitter<Message[]>();
  onPrivateMsg = new EventEmitter<{name: string, messages: Message[]}>();
  onUserChange = new EventEmitter<string[]>();
  onRoomChat = new EventEmitter<Message>();
  publicMessages: Message[] = [];
  privateMessages = new Map<string, Message[]>();
  names: string[] = [];
  name: string;

  constructor(private socket: SocketClient, private router: Router, private authService: AuthService) {
    this.initSocketConnection(socket);
    this.authService.userJoined.subscribe(name => this.name = name);
  }

  private initSocketConnection(socket: SocketClient) {
    socket.connect(this.domain, this.port);
    socket.on('close', () => console.warn('Lost connection!'));
    socket.on('chat', (msg: Message) => this.onChat(msg));
    socket.on('users', (names: string[]) => this.onNewName(names));
    socket.on('private', (msg: Message) => this.receivePrivateMsg(msg));
    socket.on('room/chat', (msg: Message) => this.onRoomChat.emit(msg));
  }

  sendMessage(msg: string) {
    this.socket.send('chat', msg);
  }

  private onChat(msg: Message) {
    this.publicMessages.push(msg);
    this.onMessage.emit(this.publicMessages.slice());
  }

  private onNewName(names: string[]) {
    this.names = names.filter(name => name !== this.name);
    this.onUserChange.emit(this.names.slice());
  }

  sendPrivateMsg(target: string, msg: string) {
    const message = new Message(this.name, msg);
    this.updatePrivateMessages(target, message);
    this.socket.send('private', new Message(target, msg));
  }

  sendToRoom(msg: string) {
    this.socket.send('room/chat', msg);
  }

  joinRoom(room: string) {
    this.socket.send('join', room);
  }

  private updatePrivateMessages(target: string, message: Message) {
    let prevMessages = this.privateMessages.get(target);
    if (prevMessages == undefined) {
      prevMessages = [message];
      this.privateMessages.set(target, prevMessages);
    } else {
      prevMessages.push(message);
    }
    this.onPrivateMsg.emit({name: target, messages: prevMessages.slice()});
  }

  private receivePrivateMsg(msg: Message) {
    this.updatePrivateMessages(msg.name, msg);
  }
}
