import { Message } from '../classes/message';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../classes/login-response';
import { Category } from '../classes/category';
import { User } from '../classes/user';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  userId: string;
  socketService: SocketService;

  constructor(private httpClient: HttpClient) {
  }

  getMessages(pageNumber: number): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`/messages?pageNumber=${pageNumber}`);
  }

  login(userName: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      'chat-login',
      {userName: userName, password: password}
    );
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>('/categories');
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>('/users');
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId(): string {
    return this.userId;
  }

  setSocketService(socketUrl: string) {
    this.socketService = new SocketService(socketUrl);
  }

  messageSearch(data: any): Observable<Message[]> {
    return this.httpClient.post<Message[]>('/messages', data);
  }
}
