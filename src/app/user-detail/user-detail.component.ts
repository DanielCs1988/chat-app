import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent {


  @ViewChild("userForm") userForm: NgForm;

  constructor(private auth: AuthService) {
  }

  updateUser() {
    if (!this.userForm.valid) {
      return;
    }
    const nickname = this.userForm.value.nickname;
    const introduction = this.userForm.value.introduction;
    this.auth.updateProfile(nickname, introduction);
  }

}
