import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { IncidentService } from "../services/incident.service";

@Controller('incidents')
@UseGuards(JwtAuthGuard)
export class IncidentController {
    constructor(private readonly incidentService: IncidentService) {}

    @Post()
    create(@Body() body: any): Observable<any> {
        return this.incidentService.create(body);
    }

    @Get()
    findAll(): Observable<any> {
        return this.incidentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.incidentService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any): Observable<any> {
        return this.incidentService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.incidentService.remove(id);
    }
}
