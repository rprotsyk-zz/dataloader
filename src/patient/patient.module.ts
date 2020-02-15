import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service'
import { MongooseModule } from '@nestjs/mongoose';
import { PatientSchema } from './patient.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Patient', schema: PatientSchema }])],
    controllers: [PatientController],
    providers: [PatientService],
    exports: [PatientService]
})
export class PatientModule { }