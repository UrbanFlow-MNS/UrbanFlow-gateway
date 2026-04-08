import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { JwtAuthGuard } from "../guards/jwt.guard";

@Controller('intervention')
@UseGuards(JwtAuthGuard)
export class InterventionController {
    constructor(@Inject('INCIDENTS_SERVICE') private readonly interventionClient: ClientProxy) {}

    @Post()
    create(@Body() body: any): Observable<any> {
        return this.interventionClient.send({ cmd: 'intervention.create' }, body);
    }

    @Get()
    findAll(): Observable<any> {
        return this.interventionClient.send({ cmd: 'intervention.findAll' }, {});
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.interventionClient.send({ cmd: 'intervention.findOne' }, id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any): Observable<any> {
        return this.interventionClient.send({ cmd: 'intervention.update' }, { id, dto: body });
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.interventionClient.send({ cmd: 'intervention.remove' }, id);
    }
}

