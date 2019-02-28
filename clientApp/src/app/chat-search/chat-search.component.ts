import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../classes/message';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-chat-search',
  templateUrl: './chat-search.component.html',
  styleUrls: ['./chat-search.component.css']
})
export class ChatSearchComponent implements OnInit {
  @Input() userId: string;
  messages: Message[];
  searchDate: string;

  constructor(private dataSvc: DataService) { }

  ngOnInit() {
  }

  searchMessages() {
    console.log(this.searchDate);
    if (!this.searchDate) {
      return;
    }

    this.dataSvc.messageSearch(this.searchDate).subscribe(messages => {
      this.messages = messages;
    });
  }
}
