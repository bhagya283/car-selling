import { Model } from 'mongoose';
import { Order } from './order.schema';
import { ReportsService } from '../reports/reports.service';
import { MailService } from '../mail/mail.service';
export declare class OrdersService {
    private orderModel;
    private reportsService;
    private mailService;
    constructor(orderModel: Model<Order>, reportsService: ReportsService, mailService: MailService);
    create(data: any): Promise<Order>;
    private sendInvoiceEmail;
    getStatsByYear(): Promise<any[]>;
    findByBuyer(userId: string): Promise<Order[]>;
    findAll(): Promise<Order[]>;
    updateStatus(id: string, status: string): Promise<Order | null>;
    findOne(id: string): Promise<Order | null>;
}
