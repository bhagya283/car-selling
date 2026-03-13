"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const contact_schema_1 = require("./contact.schema");
const mail_service_1 = require("../mail/mail.service");
let ContactsService = class ContactsService {
    contactModel;
    configService;
    mailService;
    constructor(contactModel, configService, mailService) {
        this.contactModel = contactModel;
        this.configService = configService;
        this.mailService = mailService;
    }
    async create(createContactDto) {
        const createdContact = new this.contactModel(createContactDto);
        const savedContact = await createdContact.save();
        try {
            await this.sendContactEmails(createContactDto);
        }
        catch (error) {
            console.error('Email sending failed:', error.message);
        }
        return savedContact;
    }
    async findAll() {
        return this.contactModel.find().sort({ createdAt: -1 }).exec();
    }
    async markAsContacted(id) {
        return this.contactModel.findByIdAndUpdate(id, { status: 'contacted' }, { new: true }).exec();
    }
    async remove(id) {
        return this.contactModel.findByIdAndDelete(id).exec();
    }
    async sendContactEmails(data) {
        const { name, phone, email, service, message } = data;
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
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contact_schema_1.Contact.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService,
        mail_service_1.MailService])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map