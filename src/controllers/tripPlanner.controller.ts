import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TripPlannerHttpService } from '../services/tripPlannerHttp.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { map } from 'rxjs/operators';

@UseGuards(JwtAuthGuard)
@Controller('trip-planner')
export class TripPlannerController {
  constructor(private readonly tripPlanner: TripPlannerHttpService) {}

  @Get('fastest')
  getFastest(
    @Query('startLat') startLat: number,
    @Query('startLong') startLong: number,
    @Query('endLat') endLat: number,
    @Query('endLong') endLong: number,
    @Query('departureTimeSeconds') departureTimeSeconds: number,
  ): Observable<any> {
    const params = {
      startLat,
      startLong,
      endLat,
      endLong,
      departureTimeSeconds,
    };

      return this.tripPlanner.get('/api/pathfinder/fastest', params);
  }
}