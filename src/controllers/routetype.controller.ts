// routetype.controller.ts
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TmHttpService } from '../services/tmHttp.service';
import { JwtAuthGuard } from '../guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('routetype')
export class RouteTypesController {
    constructor(private readonly trips: TmHttpService) {}

    @Get(':agencyid')
    getRouteTypeByAgencyId(@Param('agencyid') agencyid: string): Observable<any> {
        return this.trips.get(`/api/RouteType/${agencyid}`);
    }

    @Post('create')
    createRouteType(@Body() body: any): Observable<any> {
        return this.trips.post('/api/RouteType/create', body);
    }
}