import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN_USER_CITY', 'SUPERADMIN')
@Controller('admin/city-users')
export class AdminUserCityController {

    constructor(@Inject('USER_SERVICE') private userClient: ClientProxy) { }

    @Post()
    create(@Body() body: any, @Req() req: Request): Observable<any> {
        const { id: callerId } = req['user'];
        return this.userClient.send({ cmd: 'adminUserCity.create' }, { dto: body, callerId });
    }

    @Get()
    findAll(@Req() req: Request): Observable<any> {
        const { id: callerId, role: callerRole } = req['user'];
        return this.userClient.send({ cmd: 'adminUserCity.findAll' }, { callerId, callerRole });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Observable<any> {
        const { id: callerId, role: callerRole } = req['user'];
        return this.userClient.send({ cmd: 'adminUserCity.findOne' }, { id, callerId, callerRole });
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: Request): Observable<any> {
        const { id: callerId, role: callerRole } = req['user'];
        return this.userClient.send({ cmd: 'adminUserCity.update' }, { id, body, callerId, callerRole });
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request): Observable<any> {
        const { id: callerId, role: callerRole } = req['user'];
        return this.userClient.send({ cmd: 'adminUserCity.delete' }, { id, callerId, callerRole });
    }
}
