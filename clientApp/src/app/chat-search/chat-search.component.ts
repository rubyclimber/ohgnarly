import { Component, OnInit } from '@angular/core';
import { Message } from '../classes/message';
import { DataService } from '../services/data.service';
import { ListItem } from '../classes/list-item';

@Component({
  selector: 'app-chat-search',
  templateUrl: './chat-search.component.html',
  styleUrls: ['./chat-search.component.css']
})
export class ChatSearchComponent implements OnInit {
  userId: string;
  messages: Message[];
  searchDate: Date;
  searchText: string;
  isSearching: boolean;
  searchType: string;
  searchTypes: ListItem[];

  constructor(private dataSvc: DataService) {
    this.userId = this.dataSvc.getUserId();
    this.isSearching = false;
    this.searchTypes = [
      {
        text: 'Text Search',
        value: 'searchText'
      },
      {
        text: 'Date Search',
        value: 'searchDate'
      }
    ];

    this.searchType = this.searchTypes[0].value;
  }

  ngOnInit() {
  }


  searchMessages() {
    const data = {};

    if (this.searchType === 'searchText') {
      if (!this.searchText) {
        return;
      }
      data['searchText'] = this.searchText;
    } else if (this.searchType === 'searchDate') {
      if (!this.searchDate) {
        return;
      }
      data['searchDate'] = this.searchDate;
    }

    this.isSearching = true;
    this.dataSvc.messageSearch(data).subscribe(messages => {
      this.messages = messages;
      this.isSearching = false;
    });
  }
}
