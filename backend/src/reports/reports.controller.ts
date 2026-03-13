import { Controller, Post, Body, Res, Get, Param, Inject, forwardRef } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { OrdersService } from '../orders/orders.service';
import type { Response } from 'express';

@Controller('reports')
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService,
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService
    ) { }


    @Post('booking')
    async downloadBooking(@Body() data: any, @Res() res: Response) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=booking-receipt.pdf');
        return this.reportsService.generateBookingReceipt(data, res);
    }

    @Get('invoice/:orderId')
    async downloadInvoice(@Param('orderId') orderId: string, @Res() res: Response) {
        const order = await this.ordersService.findOne(orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice-${orderId.substr(-6)}.pdf`);

        const doc = await this.reportsService.generateInvoicePDF(order, (order as any).car, (order as any).user);
        doc.pipe(res);
        doc.end();
    }

    @Get('yearly/:year')
    async downloadYearlyReport(@Param('year') year: string, @Res() res: Response) {
        const stats = await this.ordersService.getStatsByYear();
        const yearStats = stats.filter(s => s._id.toString() === year);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Annual-Report-${year}.pdf`);

        const doc = await this.reportsService.generateYearlyReportPDF(parseInt(year), yearStats);
        doc.pipe(res);
        doc.end();
    }
}
