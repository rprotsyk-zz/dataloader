
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PatientModule } from '../src/patient/patient.module';
import { PatientDto } from '../src/patient/dto/patient.dto';
import { EmailDto } from '../src/email/dto/email.dto';
import { EmailModule } from '../src/email/email.module';

describe('Patients', () => {
  let app: INestApplication;
  const fileId = '5e479030c21eaa460885ab6f';
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PatientModule,
        EmailModule,
      MongooseModule.forRoot('mongodb://usernamewillbedeleted:password1@ds151416.mlab.com:51416/patient')],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET should find all patients`, async () => {
    const response = await request(app.getHttpServer()).get('/api/patient/find-all')
    expect(response.status).toBe(200)
    console.log(`Found ${response.body.length} patients`)
    expect(response.body.length).toBeGreaterThan(0);
  });

  it(`/GET should have same data in flat file and in patient collection`, async () => {
    
    const response = await request(app.getHttpServer()).post('/api/patient/find')
    .send({fileId})
    expect(response.status).toBe(201)
    const patients = response.body as PatientDto[];
    console.log(`Found ${patients.length} patient(s) imported from file with ID: ${fileId}`)
    expect(response.body.length).toBeGreaterThan(0);
  });

  it(`/POST should find patient IDs with empty first name`, async () => {
    const response = await request(app.getHttpServer()).post('/api/patient/find')
    .send({firstName: ''})
    expect(response.status).toBe(201)
    const patients = response.body as PatientDto[];
    const patientIDs = patients.map(p => p.memberId);
    console.log(`Found ${patients.length} patient(s) with empty first name. IDs: ${patientIDs}`)
    expect(response.body.length).toBeGreaterThan(0);
  });

  it(`/POST should find Patient IDs - Email address is missing but consent is Y`, async () => {
    const response = await request(app.getHttpServer()).post('/api/patient/find')
    .send({fileId, email: '', consent: 'Y'})
    expect(response.status).toBe(201)
    const patients = response.body as PatientDto[];
    const patientIDs = patients.map(p => p.memberId);
    console.log(`Found ${patients.length} patient(s) with empty email address and consent = 'Y'. IDs: ${patientIDs}`)
    expect(response.body.length).toBeGreaterThan(0);
  });

  it(`/POST verify Emails were created in Email Collection for patients who have CONSENT as Y`, async () => {
    const response = await request(app.getHttpServer()).post('/api/patient/find')
    .send({fileId, consent: 'Y'})
    expect(response.status).toBe(201)
    const patients = response.body as PatientDto[];
    const patientIDs = patients.map(p => p.memberId);
    console.log(`Found ${patients.length} patient(s) with consent = 'Y'. IDs: ${patientIDs}`);

    const emailsResponse = await request(app.getHttpServer()).post('/api/email/find')
    .send({fileId})
    expect(response.status).toBe(201)
    const emails = response.body as EmailDto[];
    const emailIDs = patients.map(p => p.memberId);
    console.log(`${emails.length} emails(s) were created for patients with consent = 'Y'. Patient IDs: ${emailIDs}`);

    expect(patientIDs.length).toBe(emailIDs.length);
  });

  afterAll(async () => {
    await app.close();
  });
});