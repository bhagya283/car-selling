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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./order.schema");
const reports_service_1 = require("../reports/reports.service");
const mail_service_1 = require("../mail/mail.service");
let OrdersService = class OrdersService {
    orderModel;
    reportsService;
    mailService;
    constructor(orderModel, reportsService, mailService) {
        this.orderModel = orderModel;
        this.reportsService = reportsService;
        this.mailService = mailService;
    }
    async create(data) {
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
        try {
            const fullOrder = await this.orderModel.findById(savedOrder._id).populate('car').populate('user').exec();
            if (fullOrder) {
                await this.sendInvoiceEmail(fullOrder);
            }
        }
        catch (err) {
            console.error("Failed to send automated invoice", err);
        }
        return savedOrder;
    }
    async sendInvoiceEmail(order) {
        const recipientEmail = order.buyerEmail || order.user?.email;
        const recipientName = order.buyerName || order.user?.name || 'Valued Customer';
        const doc = await this.reportsService.generateInvoicePDF(order, order.car, order.user);
        const chunks = [];
        const resultPromise = new Promise((resolve, reject) => {
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
        });
        doc.end();
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
    async getStatsByYear() {
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
    async findByBuyer(userId) {
        return this.orderModel.find({ user: userId }).populate('car').exec();
    }
    async findAll() {
        return this.orderModel.find().populate('car').populate('user').exec();
    }
    async updateStatus(id, status) {
        return this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }
    async findOne(id) {
        return this.orderModel.findById(id).populate('car').populate('user').exec();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => reports_service_1.ReportsService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        reports_service_1.ReportsService,
        mail_service_1.MailService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map