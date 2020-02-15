import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { MongoGridFS } from 'mongo-gridfs'
import { GridFSBucketReadStream } from 'mongodb'
import { FileInfoDto } from './dto/file-info.dto';
import { PatientDto } from '../patient/dto/patient.dto';
import { CsvParser } from 'nest-csv-parser';
import { PatientService } from '../patient/patient.service';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import { EmailDto } from '../email/dto/email.dto';
import { CreateEmailDto } from '../email/dto/create-email.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class FilesService {
  private fileModel: MongoGridFS;

  constructor(@InjectConnection() private readonly connection: Connection, private csvParser: CsvParser,
  private patientService: PatientService, private emailService: EmailService) {
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
  }

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this.fileModel.readFileStream(id);
  }

  async findInfo(id: string): Promise<FileInfoDto> {
    const result = await this.fileModel
      .findById(id).catch( err => {throw new HttpException('File not found', HttpStatus.NOT_FOUND)} )
      .then(result => result)
    return{
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      md5: result.md5,
      contentType: result.contentType      
    }
  }

  async deleteFile(id: string): Promise<boolean>{
    return await this.fileModel.delete(id)
  }

  async fileToEntities(fileId: string): Promise<CreatePatientDto[]>{

    const csvConfig = { separator: '|' }
    const fileStream = await this.readStream(fileId);
    const parsedData: any = await this.csvParser.parse(fileStream, CreatePatientDto, null, null, csvConfig)
   
    const patientsList = (parsedData.list as PatientDto[]).map(data => {
        return {
            fileId: fileId,
            programIdentifier: data['Program Identifier'],
            dataSource: data['Data Source'],
            cardNumber: data['Card Number'],
            memberId: data['Member ID'],
            firstName: data['First Name'],
            lastName: data['Last Name'],
            dateOfBirth: data['Date of Birth'],
            address1: data['Address 1'],
            address2: data['Address 2'],
            city: data['City'],
            state: data['State'],
            zipCode: data['Zip code'],
            telephone: data['Telephone number'],
            email: data['Email Address'],
            consent: data['CONSENT'],
            mobile: data['Mobile Phone'] } as CreatePatientDto;
    });
    const patients = await this.patientService.insertMany(patientsList);
    const patientsWithConsent = patientsList
                      .filter(p => p.consent === 'Y');
    const emailsList = patientsWithConsent.map(p => 
      { return {email: p.email, 
                memberId: p.memberId, 
                fileId: p.fileId} as CreateEmailDto})

    await this.emailService.insertMany(emailsList);

    return patientsList;
  }
}