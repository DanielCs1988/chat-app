import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatComponent} from './chat/chat.component';
import {MessageBoardComponent} from './chat/message-board/message-board.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './services/auth-guard';
import {WelcomeScreenComponent} from './welcome-screen/welcome-screen.component';

const routes: Routes = [
  {path: 'login', component: WelcomeScreenComponent},
  {path: 'callback', component: WelcomeScreenComponent},
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuard], children: [
      {path: '', component: MessageBoardComponent, pathMatch: 'full'},
      {path: ':name', component: MessageBoardComponent},
      {path: 'room/:room', component: MessageBoardComponent}
    ]},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
