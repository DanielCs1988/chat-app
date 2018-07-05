import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from '../message.model';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';
import {ChatService} from '../../services/chat.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user.model';
import {ChatHistoryService} from '../../services/chat-history.service';

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.css']
})
export class MessageBoardComponent implements OnInit, OnDestroy {

  name: string;
  target: number;
  room: string;
  messages: Message[] = [];
  private channelSubscription: Subscription;
  private $chatWindow;
  @ViewChild('chatForm') chatForm: NgForm;

  constructor(
    private route: ActivatedRoute,
    private chat: ChatService,
    private history: ChatHistoryService,
    private authService: AuthService) { }

  ngOnInit() {
    this.name = this.authService.userProfile ? this.authService.userProfile.nickName : '';
    this.authService.userJoined.subscribe((user: User) => this.name = user.nickName);
    this.$chatWindow = document.querySelector('.chat-window');

    this.route.params.subscribe((params: Params) => {
      this.resetComponent();
      if (Object.keys(params).length === 0) {
        this.onPublicChat();
      }
      if (params && params['name']) {
        this.onPrivateChat(Number(params['name']));
      }
      if (params && params['room']) {
        this.onRoomChat(params['room']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
  }


  private async onPublicChat() {
    this.messages = await this.history.fetchMessagesHistory();
    // this.channelSubscription = this.chat.onMessage.subscribe(message => {
    //   // this.messages.push(message);
    //   setTimeout(() => this.$chatWindow.scrollTop = this.$chatWindow.scrollHeight, 100);
    // });
  }

  private async onPrivateChat(target: number) {
    this.target = target;
    this.messages = await this.history.fetchPrivateMessageHistory(target);
    // TODO: fresh messages might slip if there is a significant delay
    this.channelSubscription = this.chat.onPrivateMsg.subscribe(msg => {
      if (msg.id === target) {
        this.messages.push(msg.message);
        setTimeout(() => this.$chatWindow.scrollTop = this.$chatWindow.scrollHeight, 100);
      }
    });
  }

  private async onRoomChat(room: string) {
    this.room = room;
    this.chat.joinRoom(room);
    this.messages = await this.history.fetchRoomMessages(room);
    this.channelSubscription = this.chat.onRoomChat.subscribe(msg => {
      if (msg.target === room) {
        this.messages.push(msg.payload);
        setTimeout(() => this.$chatWindow.scrollTop = this.$chatWindow.scrollHeight, 100);
      }
    });
  }

  private resetComponent() {
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
    this.messages = [];
    this.target = null;
    this.room = null;
  }

  onChat() {
    const msg = this.chatForm.value.chat;
    if (!msg) return;

    if (this.target) {
      this.chat.sendPrivateMsg(this.target, msg);
    } else if (this.room) {
      this.chat.sendToRoom(this.room, msg);
    } else {
      this.chat.sendMessage(msg);
    }

    this.chatForm.reset();
  }
}
