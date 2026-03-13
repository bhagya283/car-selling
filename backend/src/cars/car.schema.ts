import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Car extends Document {
  @Prop({ required: true }) brand: string;
  @Prop({ required: true }) carModel: string; // Renamed from 'model'
  @Prop({ required: true }) year: number;
  @Prop({ required: true }) price: number;
  @Prop({ default: 'Available' }) status: string;
  @Prop() imageUrl: string;
  @Prop({ type: [String], default: [] }) images: string[];
  @Prop() sellerId: string;
}
export const CarSchema = SchemaFactory.createForClass(Car);