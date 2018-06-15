import {Component, OnInit} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  name: string;

  constructor(private chat: ChatService) { }

  ngOnInit() {
    this.name = this.chat.name;
  }
}
