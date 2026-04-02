import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TripsHttpService } from '../services/httpservice.service';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly trips: TripsHttpService) {}

    @Post('create')
    createCalendar(@Body() body: any): Observable<any> {
        return this.trips.post('/api/Calendar/create', body);
    }

    @Get('all')
    getAllCalendars(): Observable<any> {
        return this.trips.get('/api/Calendar/all');
    }
}