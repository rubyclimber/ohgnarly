import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../classes/message';

@Component({
  selector: 'app-message-viewer',
  templateUrl: './message-viewer.component.html',
  styleUrls: ['./message-viewer.component.css']
})
export class MessageViewerComponent implements OnInit {
  @Input() messages: Message[];
  @Input() userId: string;

  constructor() { }

  ngOnInit() {
  }

  messageFormat(userId: string): string {
    if (userId === this.userId) {
      return 'text-gnarly pull-left col-xs-6';
    } else {
      return 'text-primary pull-right col-xs-6';
    }
  }
}
