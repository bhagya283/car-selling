import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Car extends Document {
  @Prop({ required: true }) brand: string;
  @Prop({ required: true }) carModel: string;
  @Prop({ required: true }) year: number;
  @Prop({ required: true }) price: number;
  @Prop({ default: 'Available' }) status: string;
  @Prop() imageUrl: string;
  @Prop({ type: [String], default: [] }) images: string[];
  @Prop() sellerId: string;
  @Prop() bodyType: string;
  @Prop() mileage: number;
  @Prop() city: string;
  @Prop() fuelType: string;
  @Prop() transmission: string;
  @Prop() engine: string;
  @Prop() vin: string;
}
export const CarSchema = SchemaFactory.createForClass(Car);