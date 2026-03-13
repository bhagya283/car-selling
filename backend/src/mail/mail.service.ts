import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    constructor(private configService: ConfigService) { }

    private getTransporter() {
        const user = this.configService.get<string>('EMAIL_USER');
        const pass = this.configService.get<string>('EMAIL_PASS');

        if (!user || !pass || user.includes('your-email')) {
            console.warn('MailService: Email not configured.');
            return null;
        }

        return nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });
    }

    async sendMail(options: { to: string; subject: string; html: string; attachments?: any[] }) {
        const transporter = this.getTransporter();
        if (!transporter) return;

        try {
            await transporter.sendMail({
                from: `"Sai Automobiles" <${this.configService.get('EMAIL_USER')}>`,
                ...options,
            });
            console.log(`Email sent to ${options.to}`);
        } catch (error) {
            console.error('MailService Error:', error);
        }
    }
}
