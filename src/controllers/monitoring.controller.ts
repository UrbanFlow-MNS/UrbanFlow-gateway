import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res, UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import {
  DataLogsBody,
  ExternalApiBody,
  MicroserviceBody,
  ServerDatastampBody,
} from '@bato-urbanflow/urbanflow-models';
import { JwtAuthGuard } from '../guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('monitoring')
export class MonitoringGatewayController {
  constructor(
    @Inject('MONITORING_SERVICE') private readonly client: ClientProxy,
  ) {}

  // --- SECTION : DATA LOGS ---
  @Get('dataLogs')
  findDataLogs(@Query() query: any): Observable<DataLogsBody[]> {
    return this.client.send({ cmd: 'datalogs.find' }, query);
  }

  @Post('dataLogs')
  addDataLog(@Body() data: DataLogsBody): Observable<DataLogsBody> {
    return this.client.send({ cmd: 'datalogs.add' }, data);
  }

  // --- SECTION : EXTERNAL API ---
  @Get('externalApi')
  findExternalApi(@Query() query: any): Observable<ExternalApiBody[]> {
    return this.client.send({ cmd: 'external_api.find' }, query);
  }

  @Post('externalApi')
  addExternalApi(@Body() data: ExternalApiBody): Observable<ExternalApiBody> {
    return this.client.send({ cmd: 'external_api.add' }, data);
  }

  @Put('externalApi/:id')
  editExternalApi(
    @Param('id') id: string,
    @Body() data: ExternalApiBody,
  ): Observable<any> {
    return this.client.send({ cmd: 'external_api.edit' }, { id, body: data });
  }

  @Delete('externalApi/:id')
  deleteExternalApi(@Param('id') id: string): Observable<any> {
    return this.client.send({ cmd: 'external_api.delete' }, id);
  }

  // --- SECTION : MICROSERVICE ---
  @Get('microservice')
  findMicroservices(@Query() query: any): Observable<MicroserviceBody[]> {
    return this.client.send({ cmd: 'microservice.find' }, query);
  }

  @Post('microservice')
  addMicroservice(
    @Body() data: MicroserviceBody,
  ): Observable<MicroserviceBody> {
    return this.client.send({ cmd: 'microservice.add' }, data);
  }

  @Put('microservice/:id')
  editMicroservice(
    @Param('id') id: string,
    @Body() data: MicroserviceBody,
  ): Observable<any> {
    return this.client.send({ cmd: 'microservice.edit' }, { id, body: data });
  }

  @Delete('microservice/:id')
  deleteMicroservice(@Param('id') id: string): Observable<any> {
    return this.client.send({ cmd: 'microservice.delete' }, id);
  }

  // --- SECTION : SERVER DATASTAMP ---
  @Get('serverDatastamp')
  findServerDatastamps(@Query() query: any): Observable<ServerDatastampBody[]> {
    return this.client.send({ cmd: 'server_datastamp.find' }, query);
  }

  @Post('serverDatastamp')
  addServerDatastamp(
    @Body() data: ServerDatastampBody,
  ): Observable<ServerDatastampBody> {
    return this.client.send({ cmd: 'server_datastamp.add' }, data);
  }

  // --- SECTION : PROMETHEUS (METRICS) ---
  @Get('metrics')
  getMetrics(@Res() res: Response) {
    return this.client.send({ cmd: 'monitoring.metrics' }, {}).pipe(
      map((metrics: string) => {
        res.header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
        return res.send(metrics);
      }),
    );
  }
}
