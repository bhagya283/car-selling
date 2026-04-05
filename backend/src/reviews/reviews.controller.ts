import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly service: ReviewsService) {}

    @Post()
    create(@Body() data: any) {
        return this.service.create(data);
    }

    @Get()
    findAll(@Query('sellerId') sellerId?: string, @Query('carId') carId?: string) {
        if (sellerId) return this.service.findBySeller(sellerId);
        if (carId) return this.service.findByCar(carId);
        return this.service.findAll();
    }

    @Get('seller/:sellerId')
    findBySeller(@Param('sellerId') sellerId: string) {
        return this.service.findBySeller(sellerId);
    }

    @Get('car/:carId')
    findByCar(@Param('carId') carId: string) {
        return this.service.findByCar(carId);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
