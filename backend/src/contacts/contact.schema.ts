import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Contact extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    service: string;

    @Prop()
    message: string;

    @Prop({
        type: String,
        enum: ['new', 'contacted'],
        default: 'new',
    })
    status: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
