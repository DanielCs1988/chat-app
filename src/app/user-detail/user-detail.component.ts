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
  updatedUser: User;
  id: number;
  nickname: string;
  givenName: string;
  familyName: string;
  intro: string;
  pictureUrl: string;



  constructor(private authService: AuthService) {

    this.currentUser = authService.userProfile;

  }

  ngOnInit() {



  }

  updateUser() {
    this.id = this.authService.userProfile.id;
    this.updatedUser = new User(this.id, this.givenName, this.familyName, this.pictureUrl, this.nickname, this.intro);
    this.authService.updateProfile(this.updatedUser);
  }

}
