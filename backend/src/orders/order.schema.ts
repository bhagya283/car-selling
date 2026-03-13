import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
    car: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true })
    depositAmount: number;

    @Prop({ default: 'pending' })
    status: string; // pending, confirmed, completed, cancelled

    @Prop()
    paymentMethod: string;

    @Prop()
    deliveryAddress: string;

    @Prop()
    buyerName: string;

    @Prop()
    buyerEmail: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
