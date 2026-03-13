import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from './car.schema';

@Injectable()
export class CarsService {
    constructor(@InjectModel(Car.name) private carModel: Model<Car>) { }

    async create(carData: any): Promise<Car> {
        const newCar = new this.carModel(carData);
        return newCar.save();
    }

    async findAll(query: any): Promise<Car[]> {
        const filters: any = {};
        if (query.brand) filters.brand = query.brand;
        if (query.priceMax) filters.price = { $lte: query.priceMax };
        return this.carModel.find(filters).exec();
    }

    async findOne(id: string): Promise<Car | null> {
        return this.carModel.findById(id).exec();
    }

    async updateStatus(id: string, status: string): Promise<any> {
        return this.carModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }

    async update(id: string, carData: any): Promise<Car | null> {
        return this.carModel.findByIdAndUpdate(id, carData, { new: true }).exec();
    }

    async remove(id: string): Promise<any> {
        return this.carModel.findByIdAndDelete(id).exec();
    }
}