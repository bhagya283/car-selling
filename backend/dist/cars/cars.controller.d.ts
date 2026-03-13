import { CarsService } from './cars.service';
export declare class CarsController {
    private readonly carsService;
    constructor(carsService: CarsService);
    addCar(carData: any): Promise<import("./car.schema").Car>;
    getCars(query: any): Promise<import("./car.schema").Car[]>;
    getCarById(id: string): Promise<import("./car.schema").Car | null>;
    updateStatus(id: string, status: string): Promise<any>;
    update(id: string, carData: any): Promise<import("./car.schema").Car | null>;
    remove(id: string): Promise<any>;
}
