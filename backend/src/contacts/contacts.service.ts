import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Contact } from './contact.schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactsService {
    constructor(
        @InjectModel(Contact.name) private contactModel: Model<Contact>,
        private configService: ConfigService,
        private mailService: MailService
    ) { }

    async create(createContactDto: any): Promise<Contact> {
        const createdContact = new this.contactModel(createContactDto);
        const savedContact = await createdContact.save();

        try {
            await this.sendContactEmails(createContactDto);
        } catch (error) {
            console.error('Email sending failed:', error.message);
        }

        return savedContact;
    }

    async findAll(): Promise<Contact[]> {
        return this.contactModel.find().sort({ createdAt: -1 }).exec();
    }

    async markAsContacted(id: string): Promise<Contact | null> {
        return this.contactModel.findByIdAndUpdate(id, { status: 'contacted' }, { new: true }).exec();
    }

    async remove(id: string): Promise<any> {
        return this.contactModel.findByIdAndDelete(id).exec();
    }

    private async sendContactEmails(data: any) {
        const { name, phone, email, service, message } = data;

        // Email to Owner
        await this.mailService.sendMail({
            to: this.configService.get('CLIENT_EMAIL') || 'harsh.s.vajani@gmail.com',
            subject: '🔥 New Enquiry — Sai Automobiles Website',
            html: `
                <h2 style="color:#004e82;">New Website Enquiry</h2>
                <p><b>Name:</b> ${name}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Service Interested:</b> ${service || "Not specified"}</p>
                <p><b>Message:</b> ${message || "None"}</p>
                <hr/>
                <p style="color:#6b7280;">Sent from Sai Automobiles website contact form.</p>
            `,
        });

        // Email to Customer
        await this.mailService.sendMail({
            to: email,
            subject: 'Thank you for contacting Sai Automobiles',
            html: `
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #E5E7EB; border-radius:8px; overflow:hidden;">
                    <div style="background:#004e82; color:white; padding:16px;">
                        <h2 style="margin:0;">Sai Automobiles</h2>
                        <p style="margin:0; font-size:14px;">Premium Vehicle Solutions</p>
                    </div>
                    <div style="padding:20px;">
                        <p>Hello <b>${name}</b>,</p>
                        <p>Thank you for reaching out to <b>Sai Automobiles</b>. Our team has received your inquiry regarding <b>${service || 'our services'}</b> and will contact you shortly.</p>
                        <h3 style="color:#004e82;">Your Enquiry Details</h3>
                        <p><b>Message:</b> ${message || "None"}</p>
                        <hr/>
                        <p>🚀 Need a faster response?</p>
                        <p>👉 <a href="https://wa.me/9173502223331" style="background:#16A34A; color:white; padding:10px 14px; text-decoration:none; border-radius:6px;">Chat on WhatsApp</a></p>
                        <p>📞 Phone: +91 73502 223331<br/>📍 Thane, Maharashtra, India</p>
                    </div>
                    <div style="background:#F1F5F9; padding:12px; text-align:center; font-size:12px; color:#64748B;">
                        © ${new Date().getFullYear()} Sai Automobiles. All rights reserved.
                    </div>
                </div>
            `,
        });
    }
}
