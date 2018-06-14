import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ChatService} from '../services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  onSubmit() {
    const name = this.loginForm.value.name.length >= 3 ? this.loginForm.value.name : 'n00b';
    this.chatService.setName(name);
  }

}
