import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateEmailDto } from './dto/create-email.dto';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  constructor(@InjectModel('Email') private readonly emailModel: Model<EmailDto>) {}

  async create(createEmailDto: CreateEmailDto): Promise<EmailDto> {
    const createdEmail = new this.emailModel(createEmailDto);
    return createdEmail.save();
  }

  async findAll(): Promise<EmailDto[]> {
    return this.emailModel.find().exec();
  }

  async find(conditions): Promise<EmailDto[]> {
    return this.emailModel.find(conditions).exec();
  }

  async insertMany(emails: CreateEmailDto[]) {
     return this.emailModel.insertMany(emails);
  }
}
