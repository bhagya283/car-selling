import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { ReportsService } from '../reports/reports.service';
import { MailService } from '../mail/mail.service';
import * as stream from 'stream';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        @Inject(forwardRef(() => ReportsService))
        private reportsService: ReportsService,
        private mailService: MailService
    ) { }

    async create(data: any): Promise<Order> {
        const orderData = {
            car: data.carId || data.car,
            user: data.buyerId || data.userId || data.user,
            totalAmount: Number(data.totalAmount || data.amount || 0),
            depositAmount: Number(data.depositAmount || 0),
            status: data.status || 'pending',
            paymentMethod: data.paymentDetails || data.paymentMethod,
            deliveryAddress: data.deliveryAddress,
            buyerName: data.buyerName,
            buyerEmail: data.buyerEmail
        };
        const newOrder = new this.orderModel(orderData);
        const savedOrder = await newOrder.save();

        // After saving, trigger the electronic bill
        try {
            const fullOrder = await this.orderModel.findById(savedOrder._id).populate('car').populate('user').exec();
            if (fullOrder) {
                await this.sendInvoiceEmail(fullOrder);
            }
        } catch (err) {
            console.error("Failed to send automated invoice", err);
        }

        return savedOrder;
    }

    private async sendInvoiceEmail(order: any) {
        const recipientEmail = order.buyerEmail || order.user?.email;
        const recipientName = order.buyerName || order.user?.name || 'Valued Customer';

        const doc = await this.reportsService.generateInvoicePDF(order, order.car, order.user);

        // Convert PDFKit document stream to Buffer for email attachment
        const chunks: any[] = [];
        const resultPromise = new Promise<Buffer>((resolve, reject) => {
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
        });

        doc.end(); // IMPORTANT
        const result = await resultPromise;

        console.log(`Sending invoice to: ${recipientEmail}`);
        await this.mailService.sendMail({
            to: recipientEmail,
            subject: `📄 Your Invoice: ${order.car?.brand} ${order.car?.carModel}`,
            html: `
                <div style="font-family: Arial; max-width: 600px; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #004e82;">Purchase Confirmation</h2>
                    <p>Hello <b>${recipientName}</b>,</p>
                    <p>Thank you for choosing <b>Sai Automobiles</b>! Your purchase of the <b>${order.car?.brand} ${order.car?.carModel}</b> has been confirmed.</p>
                    <p>Attached to this email is your <b>official invoice</b> for your records.</p>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><b>Order ID:</b> ${order._id}</p>
                        <p style="margin: 5px 0 0 0;"><b>Total Amount:</b> Rs.${order.totalAmount.toLocaleString()}</p>
                    </div>
                    <p>Our team will contact you shortly regarding the next steps for delivery/pickup.</p>
                    <hr/>
                    <p style="font-size: 12px; color: #64748b;">Sai Automobiles - Premium Pre-Owned Vehicles</p>
                </div>
            `,
            attachments: [
                {
                    filename: `Invoice-SaiAuto-${order._id.toString().substr(-6)}.pdf`,
                    content: result,
                    contentType: 'application/pdf'
                }
            ]
        });
    }

    async getStatsByYear(): Promise<any[]> {
        return this.orderModel.aggregate([
            {
                $group: {
                    _id: { $year: "$createdAt" },
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
    }

    async findByBuyer(userId: string): Promise<Order[]> {
        return this.orderModel.find({ user: userId }).populate('car').exec();
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().populate('car').populate('user').exec();
    }

    async updateStatus(id: string, status: string): Promise<Order | null> {
        return this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }

    async findOne(id: string): Promise<Order | null> {
        return this.orderModel.findById(id).populate('car').populate('user').exec();
    }
}
