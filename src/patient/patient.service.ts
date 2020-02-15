import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientDto } from './dto/patient.dto';

@Injectable()
export class PatientService {
  constructor(@InjectModel('Patient') private readonly patientModel: Model<PatientDto>) {}

  async create(createPatientDto: CreatePatientDto): Promise<PatientDto> {
    const createdPatient= new this.patientModel(createPatientDto);
    return createdPatient.save();
  }

  async findAll(): Promise<PatientDto[]> {
    return this.patientModel.find().exec();
  }

  async find(conditions): Promise<PatientDto[]> {
    return this.patientModel.find(conditions).exec();
  }

  async insertMany(patients: CreatePatientDto[]) {
     return this.patientModel.insertMany(patients);
  }
}
