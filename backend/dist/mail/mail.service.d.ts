import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private configService;
    constructor(configService: ConfigService);
    private getTransporter;
    sendMail(options: {
        to: string;
        subject: string;
        html: string;
        attachments?: any[];
    }): Promise<void>;
}
