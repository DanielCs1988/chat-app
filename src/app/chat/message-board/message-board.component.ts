import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from '../message.model';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';
import {ChatService} from '../../services/chat.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.css']
})
export class MessageBoardComponent implements OnInit, OnDestroy {

  name: string;
  target: string;
  room: string;
  messages: Message[] = [];
  private channelSubscription: Subscription;
  @ViewChild('chatForm') chatForm: NgForm;

  constructor(private route: ActivatedRoute, private chat: ChatService) { }

  ngOnInit() {
    this.name = this.chat.name;
    this.route.params.subscribe((params: Params) => {
      this.resetComponent();
      if (Object.keys(params).length === 0) {
        this.onPublicChat();
      }
      if (params && params['name']) {
        this.onPrivateChat(params['name']);
      }
      if (params && params['room']) {
        this.onRoomChat(params['room']);
      }
    });
  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
  }


  private onPublicChat() {
    this.messages = this.chat.publicMessages;
    this.channelSubscription = this.chat.onMessage.subscribe(messages => {
      this.messages = messages;
    });
  }

  private onPrivateChat(target: string) {
    this.target = target;
    this.messages = this.chat.privateMessages.get(target);
    this.channelSubscription = this.chat.onPrivateMsg.subscribe(msg => {
      if (msg.name === target) {
        this.messages = msg.messages;
      }
    });
  }

  private onRoomChat(room: string) {
    this.room = room;
    this.chat.joinRoom(room);
    this.channelSubscription = this.chat.onRoomChat.subscribe((msg: Message) => {
      this.messages.push(msg);
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
      this.chat.sendToRoom(msg);
    } else {
      this.chat.sendMessage(msg);
    }

    this.chatForm.reset();
  }
}
