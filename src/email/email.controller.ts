import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailDto } from './dto/email.dto';
import { EmailService } from './email.service';


@Controller('api/email')
@ApiTags('Email')
export class EmailController {
    constructor(private emailService: EmailService){}

    @Post('create')
    async create(@Body() createPatientDto: CreateEmailDto): Promise<EmailDto> {
        return this.emailService.create(createPatientDto);
    }

    @Get('find-all')
    async findAll(): Promise<EmailDto[]> {
        return this.emailService.findAll();
    }

    @Post('find')
    async find(@Body() conditions): Promise<EmailDto[]> {
        return this.emailService.find(conditions);
    }
    
    @Post('create-many')
    async insertMany(@Body() patients: CreateEmailDto[]) {
        return this.emailService.insertMany(patients);
    }
}