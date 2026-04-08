import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { JwtAuthGuard } from "../guards/jwt.guard";

@Controller('sites')
@UseGuards(JwtAuthGuard)
export class SiteController {
    constructor(@Inject('INCIDENTS_SERVICE') private readonly sitesClient: ClientProxy) {}

    @Post()
    create(@Body() body: any): Observable<any> {
        console.log("Received create site request with data (gateway):", body);
        return this.sitesClient.send({ cmd: 'site.create' }, body);
    }

    @Get()
    findAll(): Observable<any> {
        return this.sitesClient.send({ cmd: 'site.findAll' }, {});
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.sitesClient.send({ cmd: 'site.findOne' }, id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any): Observable<any> {
        return this.sitesClient.send({ cmd: 'site.update' }, { id, dto: body });
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.sitesClient.send({ cmd: 'site.remove' }, id);
    }
}
