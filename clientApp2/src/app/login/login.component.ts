import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DataService } from '../services/data.service';
import { LoginResponse } from '../classes/login-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError: boolean;
  userName: string;
  password: string;
  processingLogin: boolean;
  @Output() loginEvent: EventEmitter<LoginResponse>;

  constructor(private dataSvc: DataService) {
    this.loginError = false;
    this.userName = '';
    this.password = '';
    this.processingLogin = false;

    this.loginEvent = new EventEmitter<LoginResponse>();
   }

  ngOnInit() {
  }

  login(): void {
    this.loginError = false;
    this.processingLogin = true;

    this.dataSvc.login(this.userName, this.password).subscribe(loginResp => {
      this.loginEvent.next(loginResp);
      this.processingLogin = false;
    }, (error) => {
      console.log(error);
    });
  }

  submitOnEnter(event: KeyboardEvent): boolean {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.login();
      return false;
    }

    return true;
  }
}
