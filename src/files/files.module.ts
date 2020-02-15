import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { FilesService } from '././files.service'
import { GridFsMulterConfigService } from './gridfs-multer-config.service';
import { PatientModule } from '../patient/patient.module';
import { CsvModule } from 'nest-csv-parser';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        CsvModule,
        MulterModule.registerAsync({
            useClass: GridFsMulterConfigService,
        }),
        PatientModule,
        EmailModule
    ],
    controllers: [FilesController],
    providers: [GridFsMulterConfigService, FilesService],
    exports: [FilesService]
})
export class FilesModule {}