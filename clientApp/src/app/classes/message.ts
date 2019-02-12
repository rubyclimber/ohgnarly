import { IEntity } from './ientity';

export class Message implements IEntity {
    messageBody: string;
    createdAt?: Date;
    userId: string;
    _id: string;
}
