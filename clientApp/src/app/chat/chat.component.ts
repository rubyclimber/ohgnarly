
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../classes/message';
import { UtilityService } from '../services/utility.service';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  loginError: boolean;
  userId: string;
  userName: string;
  interval: number;
  password: string;
  messages: Message[];
  message: string;
  postingMessage: boolean;
  notifyInterval: number;
  pageTitle: string;
  notifyTitle: string;
  processingLogin: boolean;


  constructor(private utilitySvc: UtilityService, private dataSvc: DataService) {
    this.pageTitle = 'Oh Gnarly';
    this.notifyTitle = 'New Message';
    this.messages = [];
    this.message = '';
    this.notifyInterval = 0;
    this.processingLogin = false;

    window.onblur = this.focusButton.bind(this);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.dataSvc.emit('disconnect', {});
  }

  isAuthenticated(): boolean {
    return !!this.userId;
  }

  login(): void {
    this.loginError = false;
    this.processingLogin = true;

    this.dataSvc.login(this.userName, this.password).subscribe(loginResp => {
      if (loginResp.success) {
        this.userId = loginResp.userId;

        if (this.isAuthenticated()) {
          window.setTimeout(this.getMessages.bind(this), 1, false);
          this.subscribeToMessageEvent();
        }
      }
      this.processingLogin = false;
    });
  }

  subscribeToMessageEvent() {
    this.dataSvc
      .fromEvent('chat-message')
      .subscribe(this.loadMessage.bind(this));
  }

  getMessages(polling: boolean): void {
    this.dataSvc.getMessages().subscribe(msgs => {
      this.processMessages(msgs, polling);
    });
  }

  messageFormat(userId: string): string {
    if (userId === this.userId) {
      return 'text-gnarly pull-left col-xs-6';
    } else {
      return 'text-primary pull-right col-xs-6';
    }
  }

  submitOnEnter(event: KeyboardEvent): boolean {
    if (event.which === 13 && !event.shiftKey) {
      this.submitMessageSocket();
      return false;
    }

    return true;
  }

  submitMessage(): void {
    if (this.message.trim().length === 0) {
      this.focusText();
      return;
    }

    this.postingMessage = true;

    const message: Message = {
      messageBody: this.message,
      userId: this.userId,
      _id: ''
    };

    this.dataSvc.addMessage(message).subscribe(msgs => {
      this.postingMessage = false;
      this.message = '';
      // this.getMessages(false);
      this.processMessages(msgs, false);
      window.setTimeout(this.focusText.bind(this));
    });
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

    // this.postingMessage = true;

    // this.dataSvc.addMessage(message).subscribe(() => {
    //   this.postingMessage = false;
    //   this.message = '';
    // });
    this.dataSvc.emit('server-message', message);
    this.message = '';
  }

  focusText(): void {
    document.getElementById('message-field').focus();
  }

  focusButton(): void {
    const button = document.getElementById('sendButton');
    if (button) {
      button.focus();
    }
  }

  startToggle(): void {
    document.title = this.notifyTitle;
    // this.notifyUser();
    this.notifyInterval = window.setInterval(() => {
      document.title = document.title === this.notifyTitle ? this.pageTitle : this.notifyTitle; },
      1000
    );
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
    document.getElementById('message-field').onfocus = undefined;
  }

  processMessages(messages: Message[], polling: boolean) {
    let messageAdded = false;
    if (messages.length !== this.messages.length) {
      for (const msg of messages) {
        if (!this.utilitySvc.contains(this.messages, msg._id)) {
          msg.messageBody = msg.messageBody.replace(/\n/g, '<br />');
          const matches = this.utilitySvc.isUrl(msg.messageBody);
          if (matches) {
            for (const match of matches) {
              msg.messageBody = msg.messageBody.replace(match, `<a class="gnarly-anchor" href="${match}" target="_blank">${match}</a>`);
            }
          }
          messageAdded = true;
          this.messages.push(msg);
        }
      }

      const messageInput = document.getElementById('message-field');
      if (messageInput !== document.activeElement && this.notifyInterval === 0 && this.message.length === 0 && messageAdded) {
        const lastMessage = this.messages[this.messages.length - 1];
        let lastMessageFromOtherUser = false;
        if (lastMessage) {
          lastMessageFromOtherUser = lastMessage.userId !== this.userId;
        }

        if (polling && lastMessageFromOtherUser) {
          this.startToggle();
          window.onfocus = this.focusText.bind(this);
          messageInput.onfocus = this.stopToggle.bind(this);
        }
      }

      if (messageAdded) {
        window.setTimeout(() => {
          const chatWindow = document.getElementById('chat-window');
          if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
          }
        });
      }
    }
  }

  loadMessage(data: {}): void {
    const message = data as Message;
    message.messageBody = this.processMessageBody(message.messageBody);
    this.messages.push(message);

    const messageInput = document.getElementById('message-field');
    if (messageInput !== document.activeElement
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

  processMessageBody(messageBody: string) {
    const matches = this.utilitySvc.isUrl(messageBody);
    if (matches) {
      for (const match of matches) {
        messageBody = messageBody.replace(match, `<a class="gnarly-anchor" href="${match}" target="_blank">${match}</a>`);
      }
    }
    return messageBody;
  }
}
