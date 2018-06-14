import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {ChatService} from '../../services/chat.service';
import {NgForm} from '@angular/forms';
import {Message} from '../message.model';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css']
})
export class PrivateChatComponent implements OnInit {

  target: string;
  messages: Message[] = [];
  @ViewChild('chatForm') chatForm: NgForm;

  constructor(private route: ActivatedRoute, private chat: ChatService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const target = params['name'];
      this.target = target;
      this.messages = this.chat.privateMessages.get(target);
      this.chat.onPrivateMsg.subscribe(msg => {
        if (msg.name === target) {
          this.messages = msg.messages;
        }
      });
    });
  }

  onChat() {
    const msg = this.chatForm.value.chat;
    if (msg) {
      this.chat.sendPrivateMsg(this.target, msg);
      this.chatForm.reset();
    }
  }

}
