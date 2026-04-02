import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TripsHttpService } from '../services/httpservice.service';

@Controller('trip')
export class TripController {
    constructor(private readonly trips: TripsHttpService) {}

    @Post('create')
    createTrip(@Body() body: any): Observable<any> {
        return this.trips.post('/api/Trip/create', body);
    }

    @Put('updateHourly/:stopId/:tripId')
    updateHourlyTrip(
        @Body() body: any,
        @Param('stopId') stopId: string,
        @Param('tripId') tripId: string,
    ): Observable<any> {
        return this.trips.put(`/api/Trip/updateHourly/${stopId}/${tripId}`, body);
    }

    @Put('updateService/:tripId')
    updateTripService(@Body() body: any, @Param('tripId') tripId: string): Observable<any> {
        return this.trips.put(`/api/Trip/updateService/${tripId}`, body);
    }

    @Delete('delete/:stopId/:tripId')
    deleteStopTrip(
        @Param('stopId') stopId: string,
        @Param('tripId') tripId: string,
    ): Observable<any> {
        return this.trips.delete(`/api/Trip/delete/${stopId}/${tripId}`);
    }

    @Delete('delete/:tripId')
    deleteTrip(@Param('tripId') tripId: string): Observable<any> {
        return this.trips.delete(`/api/Trip/delete/${tripId}`);
    }
}