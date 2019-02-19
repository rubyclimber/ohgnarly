import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { UtilityService } from './services/utility.service';
import { DataService } from './services/data.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

import { SocketIoModule } from 'ngx-socket-io';
import { MainComponent } from './main/main.component';

// const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent,
    LoginComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule
  ],
  providers: [
    UtilityService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
