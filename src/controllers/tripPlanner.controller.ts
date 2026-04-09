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

    try {
      return this.tripPlanner.get('/api/pathfinder/fastest', { params });
    } catch (error) {
      console.log("error", error);
    }
  }
}