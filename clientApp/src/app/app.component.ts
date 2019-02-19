import { Component, OnInit } from '@angular/core';
import { Category } from './classes/category';
import { User } from './classes/user';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  categories: Category[];
  users: User[];
  showCategories: boolean;
  showUsers: boolean;

  constructor(private dataSvc: DataService) {
    this.dataSvc.getUsers().subscribe(users => {
      this.users = users.filter(user => user.userName === 'asmitty92' || user.userName === 'djmurtle');
    });

    this.dataSvc.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  isLoggedIn(): boolean {
    return false;
  }

  ngOnInit() {
  }
}
