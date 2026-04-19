// vehicles.controller.ts
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TmHttpService } from '../services/tmHttp.service';

@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly trips: TmHttpService) {}

    @Get('filter/:id')
    filterVehicles(@Query() filter: Record<string, any>, @Param('id') id: string): Observable<any> {
        const queryString = new URLSearchParams(filter).toString();
        return this.trips.get(`/api/Vehicles/filter/${id}?${queryString}`);
    }

    @Post()
    createVehicle(@Body() body: any): Observable<any> {
        return this.trips.post('/api/Vehicles', body);
    }
}