import { Model } from 'mongoose';
import { Car } from './car.schema';
export declare class CarsService {
    private carModel;
    constructor(carModel: Model<Car>);
    create(carData: any): Promise<Car>;
    findAll(query: any): Promise<Car[]>;
    findOne(id: string): Promise<Car | null>;
    updateStatus(id: string, status: string): Promise<any>;
    update(id: string, carData: any): Promise<Car | null>;
    remove(id: string): Promise<any>;
}
