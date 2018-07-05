import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {SocketClient} from './services/SocketClient';
import {ChatComponent} from './chat/chat.component';
import {FormsModule} from '@angular/forms';
import {ChatService} from './services/chat.service';
import {AuthGuard} from './services/auth-guard';
import { NavigationComponent } from './chat/navigation/navigation.component';
import { MessageBoardComponent } from './chat/message-board/message-board.component';
import {AuthService} from './services/auth.service';
import {NavbarComponent} from './navbar/navbar.component';
import {AppRoutingModule} from './app-routing.module';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import {ChatHistoryService} from './services/chat-history.service';
import {HttpClientModule} from '@angular/common/http';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    NavigationComponent,
    MessageBoardComponent,
    NavbarComponent,
    WelcomeScreenComponent,
    UserDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    SocketClient,
    ChatService,
    ChatHistoryService,
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
