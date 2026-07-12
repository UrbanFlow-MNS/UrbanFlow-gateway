import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TripHttpService } from '../services/httpservice.service';
import { JwtAuthGuard } from "../guards/jwt.guard";

@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
    constructor(private readonly trips: TripHttpService) {}

    @Post('create')
    createCalendar(@Body() body: any): Observable<any> {
        return this.trips.post('/api/Calendar/create', body);
    }

    @Get('all')
    getAllCalendars(): Observable<any> {
        return this.trips.get('/api/Calendar/all');
    }
}