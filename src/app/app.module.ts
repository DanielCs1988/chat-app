import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {SocketClient} from './services/SocketClient';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ChatComponent} from './chat/chat.component';
import {FormsModule} from '@angular/forms';
import {ChatService} from './services/chat.service';
import {AuthGuard} from './services/auth-guard';
import { NavigationComponent } from './chat/navigation/navigation.component';
import { MessageBoardComponent } from './chat/message-board/message-board.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuard], children: [
    {path: '', component: MessageBoardComponent, pathMatch: 'full'},
    {path: ':name', component: MessageBoardComponent},
    {path: 'room/:room', component: MessageBoardComponent}
  ]},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    NavigationComponent,
    MessageBoardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    SocketClient,
    ChatService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
