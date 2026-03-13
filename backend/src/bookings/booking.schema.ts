import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true }) car: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) buyerId: Types.ObjectId;
  @Prop({ required: true }) bookingDate: Date;
  @Prop({ default: 'Pending' }) status: string;
  @Prop({ default: 'Test Drive' }) type: string; // Test Drive, Inquiry, Wishlist
  @Prop() message: string;
}
/**
 * testing
 */
export const BookingSchema = SchemaFactory.createForClass(Booking);
