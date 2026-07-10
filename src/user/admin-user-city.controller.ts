import { Body, Controller, Delete, Get, Inject, NotFoundException, OnModuleInit, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Request } from 'express';
import { firstValueFrom, Observable } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminUserCityServiceClient, UserRoleType } from '../../../proto/generated/typescript/user';

const ADMIN_USER_CITY_SERVICE_NAME = 'AdminUserCityService';

function userMeta(): Metadata {
    const meta = new Metadata();
    meta.add('x-internal-secret', process.env.USER_INTERNAL_SECRET ?? '');
    return meta;
}

function call<T>(client: AdminUserCityServiceClient, method: keyof AdminUserCityServiceClient, request: unknown): Observable<T> {
    const fn = client[method] as unknown as (req: unknown, meta: Metadata) => Observable<T>;
    return fn.call(client, request, userMeta());
}

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
        return await firstValueFrom(call(this.service, 'create', {
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
        const res = await firstValueFrom(call<{ users?: any[] }>(this.service, 'findAll', { callerId, callerRole: callerRole as UserRoleType }));
        return res.users ?? [];
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const { id: callerId, role: callerRole } = req['user'];
        const res = await firstValueFrom(call<{ user?: any }>(this.service, 'findOne', { id, callerId, callerRole: callerRole as UserRoleType }));
        if (!res.user) throw new NotFoundException('USER_CITY user not found');
        return res.user;
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: Request) {
        const { id: callerId, role: callerRole } = req['user'];
        return await firstValueFrom(call(this.service, 'update', {
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
        await firstValueFrom(call(this.service, 'delete', { id, callerId, callerRole: callerRole as UserRoleType }));
        return { message: 'USER_CITY user deleted successfully' };
    }
}
