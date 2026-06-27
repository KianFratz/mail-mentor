import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ScenariosService } from './scenarios.service';

@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Get('')
  findAll() {
    return this.scenariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.scenariosService.findById(id);
  }
}
