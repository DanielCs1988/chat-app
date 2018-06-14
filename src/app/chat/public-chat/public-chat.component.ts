import {Component, OnInit, ViewChild} from '@angular/core';
import {Message} from '../message.model';
import {ChatService} from '../../services/chat.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-public-chat',
  templateUrl: './public-chat.component.html',
  styleUrls: ['./public-chat.component.css']
})
export class PublicChatComponent implements OnInit {

  messages: Message[] = [];
  name: string;
  @ViewChild('chatForm') chatForm: NgForm;

  constructor(private chat: ChatService) { }

  ngOnInit() {
    this.name = this.chat.name;
    this.messages = this.chat.publicMessages;
    this.chat.onMessage.subscribe(messages => this.messages = messages);
  }

  onChat() {
    const msg = this.chatForm.value.chat;
    if (msg) {
      this.chat.sendMessage(msg);
      this.chatForm.reset();
    }
  }

}
