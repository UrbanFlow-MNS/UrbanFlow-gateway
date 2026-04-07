import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TripHttpService } from '../services/httpservice.service';
import { JwtAuthGuard } from '../guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('trip-planner')
export class TripPlannerController {
  constructor(private readonly tripPlanner: TripHttpService) {}

  @Get('fastest')
  getFastest(
    @Query('agencyId') agencyId: number,
    @Query('startLat') startLat: number,
    @Query('startLong') startLong: number,
    @Query('endLat') endLat: number,
    @Query('endLong') endLong: number,
    @Query('departureTimeSeconds') departureTimeSeconds: number,
  ): Observable<any> {
    const params = {
      agencyId,
      startLat,
      startLong,
      endLat,
      endLong,
      departureTimeSeconds,
    };

    return this.tripPlanner.get('/api/Trip/GetFastest', params);
  }

}