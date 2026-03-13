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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const orders_service_1 = require("../orders/orders.service");
let ReportsController = class ReportsController {
    reportsService;
    ordersService;
    constructor(reportsService, ordersService) {
        this.reportsService = reportsService;
        this.ordersService = ordersService;
    }
    async downloadBooking(data, res) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=booking-receipt.pdf');
        return this.reportsService.generateBookingReceipt(data, res);
    }
    async downloadInvoice(orderId, res) {
        const order = await this.ordersService.findOne(orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice-${orderId.substr(-6)}.pdf`);
        const doc = await this.reportsService.generateInvoicePDF(order, order.car, order.user);
        doc.pipe(res);
        doc.end();
    }
    async downloadYearlyReport(year, res) {
        const stats = await this.ordersService.getStatsByYear();
        const yearStats = stats.filter(s => s._id.toString() === year);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Annual-Report-${year}.pdf`);
        const doc = await this.reportsService.generateYearlyReportPDF(parseInt(year), yearStats);
        doc.pipe(res);
        doc.end();
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)('booking'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "downloadBooking", null);
__decorate([
    (0, common_1.Get)('invoice/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "downloadInvoice", null);
__decorate([
    (0, common_1.Get)('yearly/:year'),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "downloadYearlyReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => orders_service_1.OrdersService))),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        orders_service_1.OrdersService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map