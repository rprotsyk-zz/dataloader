import { Post, Get, Param, Res, Controller, UseInterceptors, UseGuards, UploadedFiles, HttpException, HttpStatus } from '@nestjs/common';
import { ApiCreatedResponse, ApiConsumes, ApiBadRequestResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileResponseDto } from './dto/file-response.dto'
import { ApiExceptionDto } from './dto/api-exception.dto';
import { PatientService } from '../patient/patient.service';

@Controller('/attachment/files')
@ApiTags('Attachments')
export class FilesController {
    constructor(private filesService: FilesService, private patientService: PatientService){}
    @Post('')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('file'))
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    upload(@UploadedFiles() files) {
        const response = [];
        files.forEach(file => {
            const fileReponse = {
                originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                id: file.id,
                filename: file.filename,
                metadata: file.metadata,
                bucketName: file.bucketName,
                chunkSize: file.chunkSize,
                size: file.size,
                md5: file.md5,
                uploadDate: file.uploadDate,
                contentType: file.contentType,
            };
            response.push(fileReponse);
            this.filesService.fileToEntities(file.id);
        });
        return response;
    }

    @Get('info/:id')
    @ApiBadRequestResponse({ type: ApiExceptionDto })
    async getFileInfo(@Param('id') id: string): Promise<FileResponseDto> {        
        const file = await this.filesService.findInfo(id)
        const filestream = await this.filesService.readStream(id)
        if(!filestream){
            throw new HttpException('An error occurred while retrieving file info', HttpStatus.EXPECTATION_FAILED)
        }
        return {
            message: 'File has been detected',
            file: file
        }
    }

    @Get(':id')
    @ApiBadRequestResponse({ type: ApiExceptionDto })
    async getFile(@Param('id') id: string, @Res() res) {        
        const file = await this.filesService.findInfo(id)
        const filestream = await this.filesService.readStream(id)
        if(!filestream){
            throw new HttpException('An error occurred while retrieving file', HttpStatus.EXPECTATION_FAILED)
        }
        res.header('Content-Type', file.contentType);
        return filestream.pipe(res)
    }

    @Get('download/:id')
    @ApiBadRequestResponse({ type: ApiExceptionDto })
    async downloadFile(@Param('id') id: string, @Res() res) {
        const file = await this.filesService.findInfo(id)        
        const filestream = await this.filesService.readStream(id)
        if(!filestream){
            throw new HttpException('An error occurred while retrieving file', HttpStatus.EXPECTATION_FAILED)
        } 
        res.header('Content-Type', file.contentType);
        res.header('Content-Disposition', 'attachment; filename=' + file.filename);
        return filestream.pipe(res) 
    }

    @Get('delete/:id')
    @ApiBadRequestResponse({ type: ApiExceptionDto })
    @ApiCreatedResponse({ type: FileResponseDto })
    async deleteFile(@Param('id') id: string): Promise<FileResponseDto> {
        const file = await this.filesService.findInfo(id)
        const filestream = await this.filesService.deleteFile(id)
        if(!filestream){
            throw new HttpException('An error occurred during file deletion', HttpStatus.EXPECTATION_FAILED)
        }        
        return {
            message: 'File has been deleted',
            file: file
        }
    }
}