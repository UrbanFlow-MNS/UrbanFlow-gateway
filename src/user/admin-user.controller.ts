import { Body, Controller, Delete, Get, Inject, NotFoundException, OnModuleInit, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom, Observable } from 'rxjs';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard, JwtPayload } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminUserServiceClient, UserRoleType } from '../../../proto/generated/typescript/user';

const ADMIN_USER_SERVICE_NAME = 'AdminUserService';

function userMeta(): Metadata {
    const meta = new Metadata();
    meta.add('x-internal-secret', process.env.USER_INTERNAL_SECRET ?? '');
    return meta;
}

function call<T>(client: AdminUserServiceClient, method: keyof AdminUserServiceClient, request: unknown): Observable<T> {
    const fn = client[method] as unknown as (req: unknown, meta: Metadata) => Observable<T>;
    return fn.call(client, request, userMeta());
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPERADMIN', 'ADMIN_USER_CITY', 'ADMIN_TECHNICIAN')
@Controller('admin/users')
export class AdminUserController implements OnModuleInit {
    private service!: AdminUserServiceClient;

    constructor(@Inject('ADMIN_USER_PACKAGE') private readonly client: ClientGrpc) { }

    onModuleInit() {
        this.service = this.client.getService<AdminUserServiceClient>(ADMIN_USER_SERVICE_NAME);
    }

    @Post()
    async create(@Body() body: any, @CurrentUser() user: JwtPayload) {
        return await firstValueFrom(call(this.service, 'create', {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
            role: body.role as UserRoleType,
            callerId: user.sub,
            callerRole: user.role as UserRoleType,
        }));
    }

    @Get()
    async findAll(@CurrentUser() user: JwtPayload) {
        const res = await firstValueFrom(call<{ users?: any[] }>(this.service, 'findAll', {
            callerId: user.sub,
            callerRole: user.role as UserRoleType,
        }));
        return res.users ?? [];
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
        const res = await firstValueFrom(call<{ user?: any }>(this.service, 'findOne', {
            id,
            callerId: user.sub,
            callerRole: user.role as UserRoleType,
        }));
        if (!res.user) throw new NotFoundException('User not found');
        return res.user;
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: any, @CurrentUser() user: JwtPayload) {
        return await firstValueFrom(call(this.service, 'update', {
            id,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
            callerId: user.sub,
            callerRole: user.role as UserRoleType,
        }));
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
        await firstValueFrom(call(this.service, 'delete', {
            id,
            callerId: user.sub,
            callerRole: user.role as UserRoleType,
        }));
        return { message: 'User deleted successfully' };
    }
}
