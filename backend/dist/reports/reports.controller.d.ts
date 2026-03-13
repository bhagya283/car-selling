import { ReportsService } from './reports.service';
import { OrdersService } from '../orders/orders.service';
import type { Response } from 'express';
export declare class ReportsController {
    private readonly reportsService;
    private readonly ordersService;
    constructor(reportsService: ReportsService, ordersService: OrdersService);
    downloadBooking(data: any, res: Response): Promise<void>;
    downloadInvoice(orderId: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    downloadYearlyReport(year: string, res: Response): Promise<void>;
}
