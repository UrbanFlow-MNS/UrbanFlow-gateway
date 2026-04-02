import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TripsHttpService } from '../services/httpservice.service';

@Controller('routetype')
export class RouteTypeController {
    constructor(private readonly trips: TripsHttpService) {}

    @Post('create')
    createRouteType(@Body() body: any): Observable<any> {
        return this.trips.post('/api/RouteType/create', body);
    }

    @Get('all')
    getAllRouteTypes(): Observable<any> {
        return this.trips.get('/api/RouteType/all');
    }
}