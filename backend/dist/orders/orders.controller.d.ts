import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: any): Promise<import("./order.schema").Order>;
    findAll(): Promise<import("./order.schema").Order[]>;
    getYearlyStats(): Promise<any[]>;
    findByMe(req: any, userId?: string): Promise<import("./order.schema").Order[]>;
    findOne(id: string): Promise<import("./order.schema").Order | null>;
    updateStatus(id: string, status: string): Promise<import("./order.schema").Order | null>;
}
