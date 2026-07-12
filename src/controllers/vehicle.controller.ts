import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TmHttpService } from '../services/tmHttp.service';
import { JwtAuthGuard } from '../guards/jwt.guard';

@UseGuards(JwtAuthGuard)
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

    @Get('status')
    getVehicleStatus(): Observable<any> {
        return this.trips.get('/api/Vehicles/status');
    }

    @Put(':vehicleId') 
    updateVehicle(@Body() body: any, @Param('vehicleId') vehicleId: string): Observable<any> {
        return this.trips.put(`/api/Vehicles/${vehicleId}`, body);
    }

    @Patch('status/:vehicleId')
    updateVehicleStatus(@Body() body: any, @Param('vehicleId') vehicleId: string): Observable<any> {
        return this.trips.patch(`/api/Vehicles/status/${vehicleId}`, body);
    }

    @Delete(':vehicleId') 
    deleteVehicle(@Param('vehicleId') vehicleId: string): Observable<any> {
        return this.trips.delete(`/api/Vehicles/${vehicleId}`);
    }

    @Get('vehicles/:agencyId') 
    getVehiclesByAgency(@Param('agencyId') agencyId: string): Observable<any> {
        return this.trips.get(`/api/Vehicles/vehicles/${agencyId}`);
    }
}