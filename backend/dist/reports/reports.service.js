"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require('pdfkit');
let ReportsService = class ReportsService {
    async generateBookingReceipt(data, res) {
        console.log('Generating Booking Receipt PDF...');
        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(res);
        doc.fillColor('#2563eb').fontSize(24).text('BOOKING RECEIPT', { align: 'center' }).moveDown();
        doc.fillColor('#1e293b').fontSize(12)
            .text(`Booking Number: BK-${Date.now()}`)
            .text(`Customer ID: ${data.buyerId}`)
            .moveDown();
        doc.fontSize(18).text('Vehicle Reserved').moveDown(0.5);
        doc.fontSize(12).text(`Car ID: ${data.carId}`);
        doc.text(`Estimated Pickup: ${new Date(data.bookingDate).toLocaleDateString()}`);
        doc.moveDown(2).fontSize(14).text('Please present this PDF at the dealership.', { align: 'center' });
        doc.end();
    }
    async generateInvoicePDF(order, car, user) {
        console.log(`Generating Premium Invoice PDF for order: ${order?._id}`);
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const primaryColor = '#004e82';
        const secondaryColor = '#64748b';
        const borderColor = '#e2e8f0';
        const successColor = '#059669';
        doc.rect(0, 0, 600, 100).fill(primaryColor);
        doc.fillColor('#ffffff').fontSize(24).text('TAX INVOICE', 40, 35, { characterSpacing: 2 });
        doc.fontSize(10).fillColor('#ffffff').text('SAI AUTOMOBILES', 400, 30, { align: 'right' });
        doc.text('Premium Pre-Owned Vehicles', 400, 45, { align: 'right' });
        doc.text('Thane, Maharashtra, India', 400, 60, { align: 'right' });
        doc.text('+91 73502 22333', 400, 75, { align: 'right' });
        doc.moveDown(4);
        const infoY = 120;
        doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text('INVOICE TO:', 40, infoY);
        doc.font('Helvetica').text(user?.name || 'Customer', 40, infoY + 15);
        doc.text(user?.email || '', 40, infoY + 30);
        doc.text(user?.phone || '', 40, infoY + 45);
        doc.text(order?.deliveryAddress || 'Store Pickup', 40, infoY + 60, { width: 200 });
        doc.font('Helvetica-Bold').text('INVOICE DETAILS:', 350, infoY);
        doc.font('Helvetica').text(`Invoice #: `, 350, infoY + 15, { continued: true }).font('Helvetica-Bold').text(`INV-${order?._id?.toString().substr(-8).toUpperCase()}`);
        doc.font('Helvetica').text(`Date: `, 350, infoY + 30, { continued: true }).font('Helvetica-Bold').text(new Date(order?.createdAt || Date.now()).toLocaleDateString());
        doc.font('Helvetica').text(`Status: `, 350, infoY + 45, { continued: true }).font('Helvetica-Bold').fillColor(successColor).text('PAID (Deposit)');
        const tableTop = 230;
        doc.rect(40, tableTop, 515, 25).fill('#f8fafc');
        doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold');
        doc.text('VEHICLE DESCRIPTION', 50, tableTop + 8);
        doc.text('YEAR', 300, tableTop + 8);
        doc.text('CHASSIS NO.', 380, tableTop + 8);
        doc.text('AMOUNT', 480, tableTop + 8, { align: 'right' });
        const rowTop = tableTop + 35;
        doc.fillColor('#000000').font('Helvetica').fontSize(10);
        doc.text(`${car?.brand} ${car?.carModel}`, 50, rowTop);
        doc.text(`${car?.year}`, 300, rowTop);
        doc.text(`${car?.vin?.substr(-10).toUpperCase() || 'N/A'}`, 380, rowTop);
        doc.font('Helvetica-Bold').text(`Rs.${car?.price?.toLocaleString()}`, 480, rowTop, { align: 'right' });
        doc.moveTo(40, rowTop + 20).lineTo(555, rowTop + 20).lineWidth(0.5).stroke(borderColor);
        const feeTop = rowTop + 35;
        doc.font('Helvetica').text('Documentation & RTO Registration Fees', 50, feeTop);
        doc.font('Helvetica-Bold').text('Rs.499', 480, feeTop, { align: 'right' });
        if (order.deliveryMethod === 'delivery') {
            doc.font('Helvetica').text('Premium Secure Delivery Fee', 50, feeTop + 20);
            doc.font('Helvetica-Bold').text('Rs.499', 480, feeTop + 20, { align: 'right' });
        }
        const summaryTop = 400;
        doc.rect(340, summaryTop, 215, 100).stroke(borderColor);
        doc.fontSize(10).fillColor(secondaryColor).text('TOTAL SALES PRICE', 350, summaryTop + 15);
        doc.fillColor('#000000').font('Helvetica-Bold').text(`Rs.${order?.totalAmount?.toLocaleString()}`, 480, summaryTop + 15, { align: 'right' });
        doc.fillColor(secondaryColor).font('Helvetica').text('DEPOSIT PAID', 350, summaryTop + 40);
        doc.fillColor(primaryColor).font('Helvetica-Bold').text(`-Rs.${order?.depositAmount?.toLocaleString()}`, 480, summaryTop + 40, { align: 'right' });
        doc.moveTo(350, summaryTop + 60).lineTo(545, summaryTop + 60).stroke(borderColor);
        doc.fontSize(12).fillColor(primaryColor).text('BALANCE DUE', 350, summaryTop + 75);
        const balance = (order?.totalAmount || 0) - (order?.depositAmount || 0);
        doc.text(`Rs.${balance.toLocaleString()}`, 480, summaryTop + 75, { align: 'right' });
        doc.fontSize(8).fillColor(secondaryColor)
            .text('1. All sales are final upon full payment.', 40, 700)
            .text('2. Please keep this invoice for your ownership transfer paperwork.', 40, 712)
            .text('3. This document confirms your successful reservation deposit.', 40, 724);
        doc.rect(40, 750, 515, 50).fill('#f1f5f9');
        doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold')
            .text('Thank you for choosing Sai Automobiles!', 40, 765, { align: 'center', width: 515 })
            .font('Helvetica').fontSize(8).fillColor(secondaryColor)
            .text('This is a computer-generated tax invoice. No signature required.', 40, 778, { align: 'center', width: 515 });
        return doc;
    }
    async generateYearlyReportPDF(year, stats) {
        console.log(`Generating Yearly Purchase Report for: ${year}`);
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const primaryColor = '#004e82';
        const borderColor = '#e2e8f0';
        doc.rect(0, 0, 600, 80).fill(primaryColor);
        doc.fillColor('#ffffff').fontSize(20).text('ANNUAL SALES REPORT', 40, 30);
        doc.fontSize(12).text(`Fiscal Year: ${year}`, 400, 35, { align: 'right' });
        doc.moveDown(4);
        const totalSales = stats.reduce((acc, curr) => acc + (curr.totalSales || 0), 0);
        const totalRevenue = stats.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
        doc.fillColor('#000000').fontSize(14).font('Helvetica-Bold').text('Business Summary', 40, 110);
        doc.rect(40, 135, 240, 60).stroke(borderColor);
        doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('TOTAL REVENUE', 50, 145);
        doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text(`Rs.${totalRevenue.toLocaleString()}`, 50, 165);
        doc.rect(300, 135, 240, 60).stroke(borderColor);
        doc.fontSize(10).font('Helvetica').fillColor('#64748b').text('UNITS SOLD', 310, 145);
        doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text(`${totalSales} Vehicles`, 310, 165);
        doc.moveDown(4);
        doc.fillColor('#000000').fontSize(12).font('Helvetica-Bold').text(`Performance Details for ${year}`, 40, 230);
        const tableTop = 255;
        doc.rect(40, tableTop, 515, 20).fill('#f8fafc');
        doc.fillColor(primaryColor).fontSize(9).text('METRIC', 50, tableTop + 6);
        doc.text('ACTUAL VALUE', 480, tableTop + 6, { align: 'right' });
        doc.fillColor('#000000').font('Helvetica').fontSize(10);
        doc.text('Total Invoiced Amount', 50, tableTop + 30);
        doc.text(`Rs.${totalRevenue.toLocaleString()}`, 480, tableTop + 30, { align: 'right' });
        doc.text('Average Deal Value', 50, tableTop + 50);
        const avg = totalSales > 0 ? totalRevenue / totalSales : 0;
        doc.text(`Rs.${Math.round(avg).toLocaleString()}`, 480, tableTop + 50, { align: 'right' });
        doc.text('Growth Projection', 50, tableTop + 70);
        doc.fillColor('#059669').text(`+14.2% Estimated`, 480, tableTop + 70, { align: 'right' });
        doc.fontSize(8).fillColor('#94a3b8').text('Generated by Sai Automobiles Internal ERP System', 40, 750, { align: 'center', width: 515 });
        return doc;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)()
], ReportsService);
//# sourceMappingURL=reports.service.js.map