import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { JwtAuthGuard } from "../guards/jwt.guard";

@Controller('incidents')
@UseGuards(JwtAuthGuard)
export class IncidentController {
    constructor(@Inject('INCIDENTS_SERVICE') private readonly incidentsClient: ClientProxy) {}

    @Post()
    create(@Body() body: any): Observable<any> {
        console.log("Received create incident request with data (gateway):", body);
        return this.incidentsClient.send({ cmd: 'incident.create' }, body);
    }

    @Get()
    findAll(): Observable<any> {
        return this.incidentsClient.send({ cmd: 'incident.findAll' }, {});
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.incidentsClient.send({ cmd: 'incident.findOne' }, id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any): Observable<any> {
        return this.incidentsClient.send({ cmd: 'incident.update' }, { id, dto: body });
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.incidentsClient.send({ cmd: 'incident.remove' }, id);
    }
}
