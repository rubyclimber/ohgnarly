import { Message } from '../classes/message';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../classes/login-response';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../environments/environment';
import { Category } from '../classes/category';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class DataService extends Socket {
  apiKey: string;
  userId: string;

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
      headers: this.getHeaders(false)
    };
    return this.httpClient.post<LoginResponse>(
      `${environment.socketUrl}/chat-login`,
      {userName: userName, password: password},
      options
    );
  }

  getCategories(): Observable<Category[]> {
    const options = {
      headers: this.getHeaders(false)
    };
    return this.httpClient.get<Category[]>(`${environment.socketUrl}/categories`, options);
  }

  getUsers(): Observable<User[]> {
    const options = {
      headers: this.getHeaders(false)
    };
    return this.httpClient.get<User[]>(`${environment.socketUrl}/users`, options);
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId(): string {
    return this.userId;
  }

  private getHeaders(useApiKey: boolean = true): HttpHeaders {
    let headers = new HttpHeaders().append('sender', 'ohGnarlyChat');
    if (useApiKey) {
      headers = headers.append('api-key', this.apiKey);
    }
    return headers;
  }
}
