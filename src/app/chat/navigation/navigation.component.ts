import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UserDTO} from '../../models/userdto.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  private ROOMS_URL = '/api/rooms';

  users: UserDTO[] = [];
  rooms: string[] = [];

  constructor(private chat: ChatService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.users = this.chat.currentUsers;
    this.chat.onUserChange.subscribe(users => this.users = users);
    this.http.get<{id: number, name: string}[]>(this.ROOMS_URL)
      .subscribe(roomNames => this.rooms = roomNames.map(room => room.name));
  }

}
