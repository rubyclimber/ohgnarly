import { Message } from '../classes/message';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../classes/login-response';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../environments/environment';
import { Category } from '../classes/category';
import { User } from '../classes/user';

@Injectable()
export class DataService extends Socket {

  constructor(private httpClient: HttpClient) {
    super({url: environment.socketUrl, options: {}});
  }

  getMessages(): Observable<Message[]> {
    const options = {
      headers: this.getHeaders()
    };
    return this.httpClient.get<Message[]>(`${environment.socketUrl}/messages`, options);
  }

  addMessage(message: Message): Observable<Message[]> {
    const options = {
      headers: this.getHeaders()
    };
    return this.httpClient.post<Message[]>(`${environment.socketUrl}/message`, message, options);
  }

  login(userName: string, password: string): Observable<LoginResponse> {
    const options = {
      headers: this.getHeaders()
    };
    return this.httpClient.post<LoginResponse>(
      `${environment.socketUrl}/chat-login`,
      {userName: userName, password: password},
      options
    );
  }

  getCategories(): Observable<Category[]> {
    const options = {
      headers: this.getHeaders()
    };
    return this.httpClient.get<Category[]>(`${environment.socketUrl}/categories`, options);
  }

  getUsers(): Observable<User[]> {
    const options = {
      headers: this.getHeaders()
    };
    return this.httpClient.get<User[]>(`${environment.socketUrl}/users`, options);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().append('api-key', 'M1lxUG7MdBbvsaPEjono+w==').append('sender', 'ohGnarlyChat');
  }
}
