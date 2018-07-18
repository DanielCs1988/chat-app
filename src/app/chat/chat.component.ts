import {Component, OnInit} from '@angular/core';
import {ChatHistoryService} from '../services/chat-history.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  constructor(private history: ChatHistoryService) {}

  ngOnInit(): void {
    this.history.initMessageService();
  }

}
