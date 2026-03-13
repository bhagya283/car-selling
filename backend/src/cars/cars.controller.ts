import { Controller, Post, Get, Body, Query, Param, Patch, Delete } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
    constructor(private readonly carsService: CarsService) { }

    @Post()
    async addCar(@Body() carData: any) {
        return this.carsService.create(carData);
    }

    @Get()
    async getCars(@Query() query: any) {
        return this.carsService.findAll(query);
    }

    @Get(':id')
    async getCarById(@Param('id') id: string) {
        return this.carsService.findOne(id);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.carsService.updateStatus(id, status);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() carData: any) {
        return this.carsService.update(id, carData);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.carsService.remove(id);
    }
}