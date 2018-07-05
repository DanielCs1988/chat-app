import {EventEmitter, Injectable} from '@angular/core';
import {SocketClient} from './SocketClient';
import {Router} from '@angular/router';
import {Message} from '../models/message.model';
import {AuthService} from './auth.service';
import {UserDTO} from '../models/userdto.model';

@Injectable()
export class ChatService {

  private domain = 'localhost';
  private port = 8080;

  // CHAT EMITTERS
  onMessage = new EventEmitter<Message>();  // PUBLIC
  onPrivateMsg = new EventEmitter<{nickname: string, message: Message}>();  // PRIVATE
  onRoomChat = new EventEmitter<{target: string, payload: Message}>();  // ROOM

  // NEW USER LOGINS
  onUserChange = new EventEmitter<UserDTO[]>();
  private currentUsers: UserDTO[] = [];

  private usersInRooms = new Map<string, UserDTO[]>();

  user: UserDTO;

  constructor(private socket: SocketClient, private router: Router, private authService: AuthService) {
    this.initSocketConnection(socket);
    this.authService.userJoined.subscribe(user => this.user = user);
  }

  private initSocketConnection(socket: SocketClient) {
    socket.connect(this.domain, this.port);
    socket.on('users', (names: UserDTO[]) => this.onNewName(names));
    socket.on('join', (resp: {target: string, payload: any}) => this.onNewUserInRoom(resp));
    socket.on('chat', (msg: Message) => this.onChat(msg));
    socket.on('private/get', (msg: Message) => this.receivePrivateMsg(msg));
    socket.on('room/chat', (data: {target: string, payload: Message}) => this.onRoomChat.emit(data));
    socket.on('close', () => console.warn('Lost connection!'));
  }

  sendMessage(msg: string) {
    this.socket.send('chat', msg);
  }

  private onChat(msg: Message) {
    this.onMessage.emit(msg);
  }

  private onNewName(names: UserDTO[]) {
    this.currentUsers = names.filter(user => user.id !== this.user.id);
    this.onUserChange.emit(this.currentUsers.slice());
  }

  sendPrivateMsg(target: string, msg: string) {
    const message = {
      name: target,
      content: msg
    };
    this.socket.send('private/send', message, (id: number) => {
      this.onPrivateMsg.emit({nickname: target, message: {...message, id}});
    });
  }

  sendToRoom(roomName: string, msg: string) {
    const message = {
      name: roomName,
      content: msg
    };
    this.socket.send('room/chat', message);
  }

  joinRoom(room: string) {
      this.socket.send('join', room);
  }

  private receivePrivateMsg(message: Message) {
    this.onPrivateMsg.emit({nickname: message.name, message});
  }

  private onNewUserInRoom(resp: {target: string, payload: any}) {
    this.usersInRooms.set(resp.target, resp.payload);
  }
}
