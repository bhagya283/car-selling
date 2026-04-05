import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './review.schema';

@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

    async create(data: any): Promise<Review> {
        return new this.reviewModel(data).save();
    }

    async findBySeller(sellerId: string): Promise<Review[]> {
        return this.reviewModel.find({ sellerId }).sort({ createdAt: -1 }).exec();
    }

    async findByCar(carId: string): Promise<Review[]> {
        return this.reviewModel.find({ carId }).sort({ createdAt: -1 }).exec();
    }

    async findAll(): Promise<Review[]> {
        return this.reviewModel.find().sort({ createdAt: -1 }).exec();
    }

    async delete(id: string): Promise<any> {
        return this.reviewModel.findByIdAndDelete(id).exec();
    }
}
