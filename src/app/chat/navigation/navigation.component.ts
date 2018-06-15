import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {Router} from '@angular/router';
import {SocketClient} from '../../services/SocketClient';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  names: string[] = [];
  rooms: string[] = [];

  constructor(private chat: ChatService, private router: Router, private socket: SocketClient) { }

  ngOnInit() {
    this.names = this.chat.names;
    this.socket.send("rooms", null, (rooms: string[]) => this.rooms = rooms);
    this.chat.onUserChange.subscribe(names => this.names = names);
  }

}
