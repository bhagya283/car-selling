import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Contact } from './contact.schema';
import { MailService } from '../mail/mail.service';
export declare class ContactsService {
    private contactModel;
    private configService;
    private mailService;
    constructor(contactModel: Model<Contact>, configService: ConfigService, mailService: MailService);
    create(createContactDto: any): Promise<Contact>;
    findAll(): Promise<Contact[]>;
    markAsContacted(id: string): Promise<Contact | null>;
    remove(id: string): Promise<any>;
    private sendContactEmails;
}
