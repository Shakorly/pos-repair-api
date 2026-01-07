import { Controller, Get, Post, Body, Patch, Param, Delete }  from '@nestjs/common';
import  { TerminalsService } from '../service/terminals.service';
import { CreateTerminalDto, UpdateTerminalDto} from '../dto';

@Controller('terminals')
export class TerminalsController {
    constructor(
        private readonly terminalService: TerminalsService
    ){}

    @Post()
    create(@Body() createTerminalDto:CreateTerminalDto){
        return this.terminalService.create(createTerminalDto);
    }

    @Get()
    findAll() {
        return this.terminalService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.terminalService.findOne(id);
    }

    @Get('serial/:serialNumber')
    findBySerialNumber(@Param('serialNumber') serialNumber: string) {
        return this.terminalService.findBySerialNumber(serialNumber);
    }

    @Patch('id')
    update(@Param('id') id:string, @Body() updateTerminalDto: UpdateTerminalDto){
        return this.terminalService.update(id, updateTerminalDto);
    }

    @Delete('id')
    remove(@Param('id') id: string) {
        return this.terminalService.remove(id);
    }

}
