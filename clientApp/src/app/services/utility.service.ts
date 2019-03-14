import { Injectable } from '@angular/core';
import { IEntity } from '../classes/ientity';

@Injectable()
export class UtilityService {

  constructor() { }

  contains<T extends IEntity>(entities: Array<T>, id: string) {
    for (const ent of entities) {
      if (ent._id === id) {
        return true;
      }
    }
    return false;
  }

  isUrl(str: string): RegExpMatchArray {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?,&//=]*)/;
    const regExp = new RegExp(expression, 'g');
    return str.match(regExp);
  }

  today(): string {
    let now = new Date();
    return `${now.getMonth()}/${now.getDate()}/${now.getFullYear}`;
  }
}
