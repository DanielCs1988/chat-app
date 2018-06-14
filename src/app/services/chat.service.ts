import {EventEmitter, Injectable} from '@angular/core';
import {SocketClient} from './SocketClient';
import {Router} from '@angular/router';
import {Message} from '../chat/message.model';

@Injectable()
export class ChatService {

  private url = "ws://192.168.0.104:8080";
  name: string;
  onMessage = new EventEmitter<Message[]>();
  onPrivateMsg = new EventEmitter<{name: string, messages: Message[]}>();
  onUserChange = new EventEmitter<string[]>();
  publicMessages: Message[] = [];
  privateMessages = new Map<string, Message[]>();
  names: string[] = [];

  constructor(private socket: SocketClient, private router: Router) {
    socket.connect(this.url);
    socket.on('open', () => console.info('Connected to server!'));
    socket.on('close', () => console.warn('Lost connection!'));
    socket.on('chat', (msg: Message) => this.onChat(msg));
    socket.on('name', (names: string[]) => this.onNewName(names));
    socket.on('private', (msg: Message) => this.receivePrivateMsg(msg));
  }

  setName(name: string) {
    this.socket.send('name', name);
    this.name = name;
    this.router.navigate(['/chat/public']);
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
