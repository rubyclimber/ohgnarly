
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Message } from '../classes/message';
import { UtilityService } from '../services/utility.service';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],

})
export class ChatComponent implements OnInit, OnDestroy {
  userId: string;
  messages: Message[];
  message: string;
  postingMessage: boolean;
  notifyInterval: number;
  pageTitle: string;
  notifyTitle: string;

  constructor(private utilitySvc: UtilityService, private dataSvc: DataService) {
    this.pageTitle = 'Oh Gnarly';
    this.notifyTitle = 'New Message';
    this.messages = [];
    this.message = '';
    this.notifyInterval = 0;
    this.userId = this.dataSvc.getUserId();

    window.onblur = (() => {
      const button = document.getElementById('sendButton');
      if (button) {
        button.focus();
      }
    }).bind(this);
  }

  ngOnInit() {
    setTimeout(this.getMessages.bind(this), 1);

    this.dataSvc.socketService
      .fromEvent('chat-message')
      .subscribe(this.loadMessage.bind(this));
  }

  ngOnDestroy() {
    this.dataSvc.socketService.emit('disconnect', {});
    this.dataSvc.socketService.removeAllListeners();
    const messageField = document.getElementById('message-field');
    if (messageField) {
      messageField.onfocus = undefined;
    }
  }

  getMessages(): void {
    this.dataSvc.messageSearch({searchDate: new Date()}).subscribe(msgs => {
      this.processMessages(msgs);
    });
  }

  submitOnEnter(event: KeyboardEvent): boolean {
    if (event.which === 13 && !event.shiftKey) {
      this.submitMessageSocket();
      return false;
    }

    return true;
  }

  submitMessageSocket(): void {
    if (this.message.trim().length === 0) {
      this.focusText();
      return;
    }

    const message: Message = {
      messageBody: this.message,
      userId: this.userId,
      _id: ''
    };

    this.dataSvc.socketService.emit('server-message', message);
    this.message = '';
  }

  focusText(): void {
    const messageField = document.getElementById('message-field');
    if (messageField) {
      messageField.focus();
    }
  }

  startToggle(): void {
      document.title = this.notifyTitle;

      this.notifyInterval = window.setInterval(() => {
        document.title = document.title === this.notifyTitle ? this.pageTitle : this.notifyTitle;
      }, 1000);
  }

  notifyUser(): void {
    const audio = new Audio();
    audio.src = '../../assets/sms-alert-1-daniel_simon.mp3';
    audio.load();
    audio.play();
  }

  stopToggle(): void {
    window.clearInterval(this.notifyInterval);
    this.notifyInterval = 0;
    document.title = this.pageTitle;
    window.onfocus = undefined;
    const messageField = document.getElementById('message-field');
    if (messageField) {
      messageField.onfocus = undefined;
    }
  }

  processMessages(messages: Message[]) {
    for (const msg of messages) {
      msg.messageBody = this.processMessageBody(msg.messageBody);
      this.messages.push(msg);
    }

    window.setTimeout(() => {
      const chatWindow = document.getElementById('chat-window');
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    });
  }

  processMessageBody(messageBody: string) {
    messageBody = messageBody.replace(/\n/g, '<br />');
    const matches = this.utilitySvc.isUrl(messageBody);
    if (matches) {
      for (const match of matches) {
        messageBody = messageBody.replace(match, `<a class="gnarly-anchor" href="${match}" target="_blank">${match}</a>`);
      }
    }
    return messageBody;
  }

  loadMessage(data) {
    const message = data as Message;
    message.messageBody = this.processMessageBody(message.messageBody);
    this.messages.push(message);

    const messageInput = document.getElementById('message-field');
    if (messageInput
      && messageInput !== document.activeElement
      && this.notifyInterval === 0
      && this.message.length === 0
      && message.userId !== this.userId) {
      if (message.userId !== this.userId) {
        this.startToggle();
        window.onfocus = this.focusText.bind(this);
        messageInput.onfocus = this.stopToggle.bind(this);
      }
    }

    window.setTimeout(() => {
      const chatWindow = document.getElementById('chat-window');
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    });
  }
}
