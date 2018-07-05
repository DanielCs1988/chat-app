import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  currentUser: User;
  userName: string;

  constructor(private authService: AuthService) {

    this.currentUser = authService.userProfile;

  }

  ngOnInit() {



  }

  updateUser()

}
