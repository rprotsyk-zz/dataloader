import { Post, Get, Param, Res, Controller, UseInterceptors, UseGuards, UploadedFiles, HttpException, HttpStatus, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiConsumes, ApiBadRequestResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientDto } from './dto/patient.dto';

@Controller('api/patient')
@ApiTags('Patient')
export class PatientController {
    constructor(private patientService: PatientService){}

    @Post('create')
    async create(@Body() createPatientDto: CreatePatientDto): Promise<PatientDto> {
        return this.patientService.create(createPatientDto);
    }

    @Get('find-all')
    async findAll(): Promise<PatientDto[]> {
        return this.patientService.findAll();
    }

    @Post('find')
    async find(@Body() conditions): Promise<PatientDto[]> {
        return this.patientService.find(conditions);
    }
    
    @Post('create-many')
    async insertMany(@Body() patients: CreatePatientDto[]) {
        return this.patientService.insertMany(patients);
    }
}