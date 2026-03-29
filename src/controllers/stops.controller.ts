import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TripsHttpService } from '../controllers/trips.httpservice';

@Controller('stops')
export class StopsController {
    constructor(private readonly trips: TripsHttpService) {}

    @Post('create')
    createStop(@Body() body: any): Observable<any> {
        return this.trips.post('/api/Stops/create', body);
    }

    @Get('all')
    getAllStops(): Observable<any> {
        return this.trips.get('/api/Stops/all');
    }

    @Put('update/:id')
    updateStop(@Body() body: any, @Param('id') id: string): Observable<any> {
        return this.trips.put(`/api/Stops/update/${id}`, body);
    }

    @Delete('delete/:id')
    deleteStop(@Param('id') id: string): Observable<any> {
        return this.trips.delete(`/api/Stops/delete/${id}`);
    }
}