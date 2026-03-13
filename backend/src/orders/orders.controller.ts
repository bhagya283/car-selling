import { Controller, Get, Post, Body, Patch, Param, Req, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() createOrderDto: any) {
        return this.ordersService.create(createOrderDto);
    }

    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @Get('stats/year')
    getYearlyStats() {
        return this.ordersService.getStatsByYear();
    }

    @Get('me')
    findByMe(@Req() req: any, @Query('userId') userId?: string) {
        if (userId) {
            return this.ordersService.findByBuyer(userId);
        }
        // Fallback to all for now, but in a real app this would be req.user.id
        return this.ordersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.ordersService.updateStatus(id, status);
    }
}
