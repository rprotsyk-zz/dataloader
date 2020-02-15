import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service'
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSchema } from './email.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Email', schema: EmailSchema }])],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule { }