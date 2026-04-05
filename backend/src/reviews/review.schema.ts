import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Review extends Document {
  @Prop() sellerId: string;
  @Prop({ required: true }) buyerId: string;
  @Prop() buyerName: string;
  @Prop() carId: string;
  @Prop({ required: true }) rating: number;
  @Prop() comment: string;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
