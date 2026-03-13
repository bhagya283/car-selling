import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './booking.schema';

@Injectable()
export class BookingsService {
    constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) { }

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
        return this.bookingModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }

    async update(id: string, data: any): Promise<any> {
        return this.bookingModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<any> {
        return this.bookingModel.findByIdAndDelete(id).exec();
    }
}
