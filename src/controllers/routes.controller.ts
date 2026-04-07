import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TripHttpService } from '../services/httpservice.service';

@Controller('routes')
export class RoutesController {
    constructor(private readonly trips: TripHttpService) {}

    @Post('create')
    createRoute(@Body() body: any): Observable<any> {
        return this.trips.post('/api/Routes/create', body);
    }

    @Get('filter')
    filterRoutes(@Query() query: any): Observable<any> {
        const params = new URLSearchParams(query).toString();
        return this.trips.get(`/api/Routes/filter?${params}`);
    }

    @Get('all')
    getAllRoutes(): Observable<any> {
        return this.trips.get('/api/Routes/all');
    }

    @Get('getAllCompleteRoutes')
    getAllCompleteRoutes(): Observable<any> {
        return this.trips.get('/api/Routes/getAllCompleteRoutes');
    }

    @Get('getDetails/:id')
    getRouteDetails(@Param('id') id: string): Observable<any> {
        return this.trips.get(`/api/Routes/getDetails/${id}`);
    }

    @Put('update/:id')
    updateRoute(@Body() body: any, @Param('id') id: string): Observable<any> {
        return this.trips.put(`/api/Routes/update/${id}`, body);
    }

    @Delete('delete/:id')
    deleteRoute(@Param('id') id: string): Observable<any> {
        return this.trips.delete(`/api/Routes/delete/${id}`);
    }
}