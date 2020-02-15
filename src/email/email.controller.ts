import { Post, Get, Param, Res, Controller, UseInterceptors, UseGuards, UploadedFiles, HttpException, HttpStatus, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiConsumes, ApiBadRequestResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailDto } from './dto/email.dto';

@Controller('api/email')
@ApiTags('Email')
export class EmailController {
    constructor(private patientService: EmailService){}

    @Post('create')
    async create(@Body() createPatientDto: CreateEmailDto): Promise<EmailDto> {
        return this.patientService.create(createPatientDto);
    }

    @Get('find-all')
    async findAll(): Promise<EmailDto[]> {
        return this.patientService.findAll();
    }

    @Post('find')
    async find(@Body() conditions): Promise<EmailDto[]> {
        return this.patientService.find(conditions);
    }
    
    @Post('create-many')
    async insertMany(@Body() patients: CreateEmailDto[]) {
        return this.patientService.insertMany(patients);
    }
}