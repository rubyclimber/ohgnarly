import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

export class SocketService extends Socket {
  constructor(socketUrl: string) {
    super({url: socketUrl, options: {}});
  }
}
