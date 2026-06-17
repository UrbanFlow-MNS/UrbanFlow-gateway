import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPERADMIN')
@Controller('agency')
export class AgencyController {

    constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) { }

    @Post()
    create(@Body() body: any, @Req() req: Request): Observable<any> {
        const { id: callerId } = req['user'];
        return this.userClient.send({ cmd: 'agency.create' }, { city: body.city, callerId });
    }

    @Get()
    findAll(): Observable<any> {
        return this.userClient.send({ cmd: 'agency.findAll' }, {});
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.userClient.send({ cmd: 'agency.findOne' }, { id });
    }

    @Post(':id/users')
    addUser(@Param('id', ParseIntPipe) id: number, @Body() body: any): Observable<any> {
        return this.userClient.send({ cmd: 'agency.addUser' }, { agencyId: id, userId: body.userId });
    }

    @Delete(':id/users/:userId')
    removeUser(@Param('id', ParseIntPipe) id: number, @Param('userId', ParseIntPipe) userId: number): Observable<any> {
        return this.userClient.send({ cmd: 'agency.removeUser' }, { agencyId: id, userId });
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.userClient.send({ cmd: 'agency.delete' }, { id });
    }
}
