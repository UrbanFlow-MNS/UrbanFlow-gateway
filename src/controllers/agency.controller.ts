import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TripsHttpService } from '../controllers/trips.httpservice';

@Controller('agency')
export class AgencyController {
    constructor(private readonly trips: TripsHttpService) {}

    @Post('create')
    createAgency(@Body() body: any): Observable<any> {
        return this.trips.post('/api/Agency/create', body);
    }

    @Get('all')
    getAllAgencies(): Observable<any> {
        console.log(this.trips.baseUrl)
        return this.trips.get('/api/Agency/all');
    }

    @Put('update/:id')
    updateAgency(@Body() body: any, @Param('id') id: string): Observable<any> {
        return this.trips.put(`/api/Agency/update/${id}`, body);
    }

    @Delete('delete/:id')
    deleteAgency(@Param('id') id: string): Observable<any> {
        return this.trips.delete(`/api/Agency/delete/${id}`);
    }
}