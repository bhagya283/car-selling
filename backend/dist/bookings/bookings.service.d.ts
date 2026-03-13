import { Model } from 'mongoose';
import { Booking } from './booking.schema';
export declare class BookingsService {
    private bookingModel;
    constructor(bookingModel: Model<Booking>);
    create(data: any): Promise<Booking>;
    findByBuyer(buyerId: string): Promise<Booking[]>;
    findAll(): Promise<Booking[]>;
    updateStatus(id: string, status: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<any>;
}
