import {Component, OnInit} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  names: string[] = [];
  rooms: string[] = ['Room 1', 'Room 2', 'Room 3'];
  name: string;

  constructor(private chat: ChatService, private router: Router) { }

  ngOnInit() {
    this.name = this.chat.name;
    this.names = this.chat.names;
    this.chat.onUserChange.subscribe(names => this.names = names);
  }
}
