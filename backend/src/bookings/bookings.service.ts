import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './booking.schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<Booking>,
        private mailService: MailService
    ) { }

    async create(data: any): Promise<Booking> {
        const bookingData = {
            ...data,
            car: data.carId || data.car,
            buyerId: data.buyerId || data.userId
        };
        return new this.bookingModel(bookingData).save();
    }

    async findByBuyer(buyerId: string): Promise<Booking[]> {
        return this.bookingModel.find({ buyerId }).populate('car').populate('buyerId').exec();
    }

    async findAll(): Promise<Booking[]> {
        return this.bookingModel.find().populate('car').populate('buyerId').exec();
    }

    async updateStatus(id: string, status: string): Promise<any> {
        const updatedBooking = await this.bookingModel.findByIdAndUpdate(id, { status }, { new: true })
            .populate('car')
            .populate('buyerId')
            .exec();

        if (updatedBooking && (status.toLowerCase() === 'confirmed' || status.toLowerCase() === 'declined')) {
            await this.sendStatusEmail(updatedBooking);
        }

        return updatedBooking;
    }

    private async sendStatusEmail(booking: any) {
        const buyer = booking.buyerId;
        if (!buyer || !buyer.email) return;

        const isConfirmed = booking.status.toLowerCase() === 'confirmed';
        const statusColor = isConfirmed ? '#10b981' : '#ef4444';
        const statusText = isConfirmed ? 'Confirmed' : 'Declined';
        const carDetails = booking.car ? `${booking.car.brand} ${booking.car.carModel}` : 'Vehicle';

        await this.mailService.sendMail({
            to: buyer.email,
            subject: `Booking Status: ${statusText} - ${carDetails}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background-color: #004e82; padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Booking Update</h1>
                    </div>
                    <div style="padding: 40px; background-color: white;">
                        <p style="font-size: 16px; color: #475569; margin-top: 0;">Hello <strong>${buyer.name}</strong>,</p>
                        <p style="font-size: 16px; color: #475569;">Your booking for the <strong>${carDetails}</strong> has been <span style="color: ${statusColor}; font-weight: bold; text-transform: uppercase;">${statusText}</span> by our team.</p>
                        
                        <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0; border-left: 4px solid #004e82;">
                            <h3 style="margin-top: 0; color: #1e293b; font-size: 18px;">Booking Details:</h3>
                            <p style="margin: 8px 0; color: #475569;"><strong>Service:</strong> ${booking.type || 'Test Drive'}</p>
                            <p style="margin: 8px 0; color: #475569;"><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                            <p style="margin: 8px 0; color: #475569;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
                        </div>

                        ${isConfirmed ? `
                        <p style="font-size: 16px; color: #475569;">We are excited to see you! Our representative will contact you shortly to coordinate the next steps.</p>
                        ` : `
                        <p style="font-size: 16px; color: #475569;">We apologize for the inconvenience. Our team might have reached out to you already, or you can contact us for more information regarding this decision.</p>
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

    async update(id: string, data: any): Promise<any> {
        return this.bookingModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<any> {
        return this.bookingModel.findByIdAndDelete(id).exec();
    }
}
