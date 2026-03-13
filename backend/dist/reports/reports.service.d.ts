import { Response } from 'express';
export declare class ReportsService {
    generateBookingReceipt(data: any, res: Response): Promise<void>;
    generateInvoicePDF(order: any, car: any, user: any): Promise<any>;
    generateYearlyReportPDF(year: number, stats: any[]): Promise<any>;
}
