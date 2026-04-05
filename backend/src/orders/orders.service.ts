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
        const updatedOrder = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true })
            .populate('car')
            .populate('user')
            .exec();

        if (updatedOrder && (status.toLowerCase() === 'confirmed' || status.toLowerCase() === 'declined')) {
            await this.sendStatusEmail(updatedOrder);
        }

        return updatedOrder;
    }

    private async sendStatusEmail(order: any) {
        const recipientEmail = order.buyerEmail || order.user?.email;
        const recipientName = order.buyerName || order.user?.name || 'Valued Customer';
        if (!recipientEmail) return;

        const isConfirmed = order.status.toLowerCase() === 'confirmed';
        const statusColor = isConfirmed ? '#10b981' : '#ef4444';
        const statusText = isConfirmed ? 'Confirmed' : 'Declined';
        const carDetails = order.car ? `${order.car.brand} ${order.car.carModel}` : 'Vehicle';

        await this.mailService.sendMail({
            to: recipientEmail,
            subject: `Order Status: ${statusText} - ${carDetails}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background-color: #004e82; padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Order Update</h1>
                    </div>
                    <div style="padding: 40px; background-color: white;">
                        <p style="font-size: 16px; color: #475569; margin-top: 0;">Hello <strong>${recipientName}</strong>,</p>
                        <p style="font-size: 16px; color: #475569;">Your order for the <strong>${carDetails}</strong> has been <span style="color: ${statusColor}; font-weight: bold; text-transform: uppercase;">${statusText}</span> by our team.</p>
                        
                        <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0; border-left: 4px solid #004e82;">
                            <h3 style="margin-top: 0; color: #1e293b; font-size: 18px;">Order Details:</h3>
                            <p style="margin: 8px 0; color: #475569;"><strong>Order ID:</strong> ${order._id}</p>
                            <p style="margin: 8px 0; color: #475569;"><strong>Amount:</strong> Rs.${order.totalAmount.toLocaleString()}</p>
                            <p style="margin: 8px 0; color: #475569;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
                        </div>

                        ${isConfirmed ? `
                        <p style="font-size: 16px; color: #475569;">Congratulations! Your order is now confirmed. Our team will reach out to you within 24-48 hours to discuss the final pickup/delivery arrangements and paperwork.</p>
                        ` : `
                        <p style="font-size: 16px; color: #475569;">We regret to inform you that your order could not be processed at this time. If you have already made a deposit, it will be refunded according to our policy. Please contact our support team for more details.</p>
                        `}

                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="font-size: 14px; color: #94a3b8; margin-bottom: 5px;">Thank you for choosing Sai Automobiles</p>
                            <a href="#" style="color: #004e82; text-decoration: none; font-weight: 600;">Visit our Website</a>
                        </div>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
                        &copy; ${new Date().getFullYear()} Sai Automobiles. All rights reserved.
                    </div>
                </div>
            `
        });
    }

    async findOne(id: string): Promise<Order | null> {
        return this.orderModel.findById(id).populate('car').populate('user').exec();
    }
}
