import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { CurrentUser } from "../decorators/current-user.decorator";
import { JwtAuthGuard, JwtPayload } from "../guards/jwt.guard";

@Controller('incidents')
export class IncidentController {
    constructor(@Inject('INCIDENTS_SERVICE') private readonly incidentsClient: ClientProxy) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: any, @CurrentUser() user: JwtPayload): Observable<any> {
        return this.incidentsClient.send({ cmd: 'incident.create' }, { ...body, callerId: user.sub });
    }

    @Get()
    findAll(): Observable<any> {
        return this.incidentsClient.send({ cmd: 'incident.findAll' }, {});
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.incidentsClient.send({ cmd: 'incident.findOne' }, id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any, @CurrentUser() user: JwtPayload): Observable<any> {
        return this.incidentsClient.send({ cmd: 'incident.update' }, { id, dto: body, callerId: user.sub, callerRole: user.role });
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload): Observable<any> {
        return this.incidentsClient.send({ cmd: 'incident.remove' }, { id, callerId: user.sub, callerRole: user.role });
    }
}
