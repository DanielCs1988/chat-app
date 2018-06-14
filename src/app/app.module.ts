import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {SocketClient} from './services/SocketClient';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ChatComponent} from './chat/chat.component';
import {FormsModule} from '@angular/forms';
import {ChatService} from './services/chat.service';
import { PrivateChatComponent } from './chat/private-chat/private-chat.component';
import { PublicChatComponent } from './chat/public-chat/public-chat.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'chat', component: ChatComponent, children: [
    {path: '', pathMatch: 'full', component: PublicChatComponent},
    {path: ':name', component: PrivateChatComponent}
  ]},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    PrivateChatComponent,
    PublicChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    SocketClient,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
