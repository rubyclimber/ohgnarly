
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
  pageNumber: number;
  currentScrollHeight: number;
  messageInterval: number;

  constructor(private utilitySvc: UtilityService, private dataSvc: DataService) {
    this.pageTitle = 'Oh Gnarly';
    this.notifyTitle = 'New Message';
    this.messages = [];
    this.message = '';
    this.notifyInterval = 0;
    this.pageNumber = 0;
    this.messageInterval = 0;
    this.userId = this.dataSvc.getUserId();

    window.onblur = (() => {
      const button = document.getElementById('sendButton');
      if (button) {
        button.focus();
      }
    }).bind(this);
  }

  ngOnInit() {
    setTimeout(this.getMessages.bind(this), 1, true, this.processMessages.bind(this));
    this.messageInterval = window.setInterval(
      this.getMessages.bind(this), 1000, true, this.processNewMessages.bind(this));

    // this.dataSvc.socketService
    //   .fromEvent('chat-message')
    //   .subscribe(this.loadMessage.bind(this));
  }

  ngOnDestroy() {
    // this.dataSvc.socketService.emit('disconnect', {});
    // this.dataSvc.socketService.removeAllListeners();
    const messageField = document.getElementById('message-field');
    window.clearInterval(this.messageInterval);
    this.messageInterval = 0;
    if (messageField) {
      messageField.onfocus = undefined;
    }
  }

  getMessages(scrollToBottom: boolean = true, messageHandler: (msgs: Message[]) => void): void {
    this.currentScrollHeight = document.getElementById('chat-window').scrollHeight || 0;
    this.dataSvc.getMessages(this.pageNumber).subscribe(msgs => {
      messageHandler(msgs);

      const scrollFunction = scrollToBottom ? this.scrollToBottom : this.maintainScrollPosition;
      setTimeout(scrollFunction.bind(this), 1);
    });
  }

  submitOnEnter(event: KeyboardEvent): boolean {
    if (event.key === 'Enter' && !event.shiftKey) {
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
    }

    this.messages = messages.concat(this.messages);
  }

  processMessageBody(messageBody: string) {
    messageBody = messageBody.replace(/\n/g, '<br />');
    const matches = this.utilitySvc.isUrl(messageBody);
    if (matches) {
      for (const match of matches) {
        if (this.isImage(match)) {
          messageBody = messageBody.replace(match,
            `<a class="gnarly-anchor" href="${match}" target="_blank"><img class="chat-image" src="${match}" alt="${match}"/></a>`);
        } else {
          messageBody = messageBody.replace(match, `<a class="gnarly-anchor" href="${match}" target="_blank">${match}</a>`);
        }
      }
    }
    return messageBody;
  }

  loadMessage(data) {
    const message = data as Message;
    message.messageBody = this.processMessageBody(message.messageBody);
    this.messages.push(message);
    this.startToggle();

    setTimeout(this.scrollToBottom.bind(this), 1);
  }

  onWindowScroll() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow && chatWindow.scrollTop === 0) {
      this.pageNumber += 1;
      this.getMessages(false, this.processMessages);
    }
  }

  scrollToBottom() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }

  maintainScrollPosition() {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight - this.currentScrollHeight;
    }
  }

  processNewMessages(messages: Message[]): void {
    for (const message of messages) {
      message.messageBody = this.processMessageBody(message.messageBody);

      if (!this.messages.some(m => m._id === message._id)) {
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
      }
    }
  }

  private isImage(match: string): boolean {
    const imageExtensions = [
      '.jpg',
      '.png',
      '.jpeg',
      '.bmp',
      '.svg',
      '.gif',
      '.tif',
      '.tiff',
      '.webp',
      '.apng'
    ];
    const index = match.lastIndexOf('.');
    return index > 0 && imageExtensions.indexOf(match.substring(index)) >= 0;
  }
}
