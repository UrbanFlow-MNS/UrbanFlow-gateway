import { Body, Controller, Delete, Get, Inject, NotFoundException, OnModuleInit, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminUserCityServiceClient, UserRoleType } from '../../../proto/generated/typescript/user';

const ADMIN_USER_CITY_SERVICE_NAME = 'AdminUserCityService';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN_USER_CITY', 'SUPERADMIN')
@Controller('admin/city-users')
export class AdminUserCityController implements OnModuleInit {
    private service!: AdminUserCityServiceClient;

    constructor(@Inject('ADMIN_USER_CITY_PACKAGE') private readonly client: ClientGrpc) { }

    onModuleInit() {
        this.service = this.client.getService<AdminUserCityServiceClient>(ADMIN_USER_CITY_SERVICE_NAME);
    }

    @Post()
    async create(@Body() body: any, @Req() req: Request) {
        const { id: callerId } = req['user'];
        return await firstValueFrom(this.service.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
            callerId,
        }));
    }

    @Get()
    async findAll(@Req() req: Request) {
        const { id: callerId, role: callerRole } = req['user'];
        const res = await firstValueFrom(this.service.findAll({ callerId, callerRole: callerRole as UserRoleType }));
        return res.users ?? [];
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const { id: callerId, role: callerRole } = req['user'];
        const res = await firstValueFrom(this.service.findOne({ id, callerId, callerRole: callerRole as UserRoleType }));
        if (!res.user) throw new NotFoundException('USER_CITY user not found');
        return res.user;
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: Request) {
        const { id: callerId, role: callerRole } = req['user'];
        return await firstValueFrom(this.service.update({
            id,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
            callerId,
            callerRole: callerRole as UserRoleType,
        }));
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const { id: callerId, role: callerRole } = req['user'];
        await firstValueFrom(this.service.delete({ id, callerId, callerRole: callerRole as UserRoleType }));
        return { message: 'USER_CITY user deleted successfully' };
    }
}
