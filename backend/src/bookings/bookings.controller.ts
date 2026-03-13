import { Controller, Post, Get, Body, Param, Patch, Req, Query, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly service: BookingsService) { }

    @Post() create(@Body() data: any) { return this.service.create(data); }

    @Get() findAll() {
        return this.service.findAll();
    }

    @Get('me') getByMe(@Req() req: any, @Query('userId') userId?: string) {
        if (userId) {
            return this.service.findByBuyer(userId);
        }
        return this.service.findAll();
    }

    @Get('buyer/:buyerId') getByBuyer(@Param('buyerId') buyerId: string) {
        return this.service.findByBuyer(buyerId);
    }

    @Patch(':id/status') updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.service.updateStatus(id, status);
    }

    @Patch(':id') update(@Param('id') id: string, @Body() data: any) {
        console.log('Update Booking Request:', id, data);
        return this.service.update(id, data);
    }

    @Delete(':id') remove(@Param('id') id: string) {
        return this.service.delete(id);
    }
}