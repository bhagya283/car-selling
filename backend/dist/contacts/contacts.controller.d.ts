import { ContactsService } from './contacts.service';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    submit(createContactDto: any): Promise<import("./contact.schema").Contact>;
    findAll(): Promise<import("./contact.schema").Contact[]>;
    markContacted(id: string): Promise<import("./contact.schema").Contact | null>;
    remove(id: string): Promise<any>;
}
