import { Component, OnInit } from '@angular/core';
import { LoginResponse } from '../classes/login-response';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userId: string;

  constructor(private dataSvc: DataService) { }

  ngOnInit() {
  }

  isAuthenticated(): boolean {
    return !!this.userId;
  }

  login(loginResp: LoginResponse): void {
    if (loginResp.success) {
      this.userId = loginResp.userId;
      this.dataSvc.setSocketService(loginResp.socketUrl);
    }
  }
}
