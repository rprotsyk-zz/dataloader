import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { PatientModule } from './patient/patient.module';
import { EmailModule } from './email/email.module';


@Module({
    imports: [ MongooseModule.forRoot('mongodb://usernamewillbedeleted:password1@ds151416.mlab.com:51416/patient'),      
        FilesModule,
        PatientModule,
        EmailModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}