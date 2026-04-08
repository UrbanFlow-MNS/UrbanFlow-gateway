import {
    Body, Controller, Delete, Get, Inject, Param,
    Post, Put, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LogBody, LogEventType } from '@bato-urbanflow/urbanflow-models';
import { JwtAuthGuard } from '../guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
    constructor(@Inject('LOGS_SERVICE') private readonly logsClient: ClientProxy) {}

    @Get()
    findWithFilters(
        @Query('numberOfElement') numberOfElement?: number,
        @Query('startingElement') startingElement?: number,
        @Query('codeOfEvent') codeOfEvent?: string,
        @Query('microserviceName') microserviceName?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ): Observable<LogBody[]> {
        return this.logsClient.send(
            { cmd: LogEventType.LOGS_GET_FILTERS },
            { numberOfElement: numberOfElement, startingElement: startingElement, codeOfEvent: codeOfEvent, microserviceName: microserviceName, startDate: startDate, endDate: endDate }
        );
    }

    @Post()
    create(@Body() log: LogBody): Observable<LogBody> {
        return this.logsClient.send({ cmd: LogEventType.LOGS_CREATE }, log);
    }
}