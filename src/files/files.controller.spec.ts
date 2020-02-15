import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';


describe('FilesController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [FilesService],
    }).compile();
  });

  describe('getFile', () => {
    it('should return file', () => {
      const appController = app.get<FilesController>(FilesController);
    });
  });
});
