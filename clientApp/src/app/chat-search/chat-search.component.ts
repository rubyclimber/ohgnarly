import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../classes/message';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-chat-search',
  templateUrl: './chat-search.component.html',
  styleUrls: ['./chat-search.component.css']
})
export class ChatSearchComponent implements OnInit {
  userId: string;
  messages: Message[];
  searchDate: Date;
  isSearching: boolean;

  constructor(private dataSvc: DataService) {
    this.userId = this.dataSvc.getUserId();
    this.isSearching = false;
  }

  ngOnInit() {
  }

  searchMessages() {
    if (!this.searchDate) {
      return;
    }

    this.isSearching = true;
    this.dataSvc.messageSearch(this.searchDate).subscribe(messages => {
      this.messages = messages;
      this.isSearching = false;
    });
  }
}
