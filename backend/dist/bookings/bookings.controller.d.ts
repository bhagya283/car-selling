import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly service;
    constructor(service: BookingsService);
    create(data: any): Promise<import("./booking.schema").Booking>;
    findAll(): Promise<import("./booking.schema").Booking[]>;
    getByMe(req: any, userId?: string): Promise<import("./booking.schema").Booking[]>;
    getByBuyer(buyerId: string): Promise<import("./booking.schema").Booking[]>;
    updateStatus(id: string, status: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<any>;
}
