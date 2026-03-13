import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ required: true }) name: string;
  @Prop({ default: 'Buyer', enum: ['Buyer', 'Seller', 'Dealer', 'Inspector', 'Admin', 'Owner'] }) role: string;
  @Prop() phone?: string;
  @Prop() address?: string;
  @Prop() city?: string;
}
export const UserSchema = SchemaFactory.createForClass(User);