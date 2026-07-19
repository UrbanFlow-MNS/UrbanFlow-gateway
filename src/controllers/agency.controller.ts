import { Body, Controller, Delete, Get, Inject, NotFoundException, OnModuleInit, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom, Observable } from 'rxjs';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard, JwtPayload } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AgencyServiceClient } from '../../../proto/generated/typescript/user';

function userMeta(): Metadata {
    const meta = new Metadata();
    meta.add('x-internal-secret', process.env.USER_INTERNAL_SECRET ?? '');
    return meta;
}

function call<T>(client: AgencyServiceClient, method: keyof AgencyServiceClient, request: unknown): Observable<T> {
    const fn = client[method] as unknown as (req: unknown, meta: Metadata) => Observable<T>;
    return fn.call(client, request, userMeta());
}

@UseGuards(JwtAuthGuard)
@Controller('agency')
export class AgencyController implements OnModuleInit {
    private agencyService!: AgencyServiceClient;

    constructor(@Inject('AGENCY_PACKAGE') private readonly agencyClient: ClientGrpc) { }

    onModuleInit() {
        this.agencyService = this.agencyClient.getService<AgencyServiceClient>("AgencyService");
    }

    @Get()
    async findAll() {
        const res = await firstValueFrom(call<{ agencies?: any[] }>(this.agencyService, 'findAll', {}));
        return res.agencies ?? [];
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const res = await firstValueFrom(call<{ agency?: any }>(this.agencyService, 'findOne', { id }));
        if (!res.agency) throw new NotFoundException('Agency not found');
        return res.agency;
    }

    @UseGuards(RolesGuard)
    @Roles('SUPERADMIN', 'ADMIN_USER_CITY', 'ADMIN_TECHNICIAN')
    @Get(':id/users')
    async findUsers(@Param('id', ParseIntPipe) id: number) {
        const res = await firstValueFrom(call<{ users?: any[] }>(this.agencyService, 'findUsers', { id }));
        return (res.users ?? []).map(u => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            role: u.role,
        }));
    }

    @UseGuards(RolesGuard)
    @Roles('SUPERADMIN')
    @Post()
    async create(@Body() body: any, @CurrentUser() user: JwtPayload) {
        return await firstValueFrom(call(this.agencyService, 'create', { city: body.city, callerId: user.sub }));
    }

    @UseGuards(RolesGuard)
    @Roles('SUPERADMIN', 'ADMIN_USER_CITY')
    @Post(':id/users')
    async addUser(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        await firstValueFrom(call(this.agencyService, 'addUser', { agencyId: id, userId: body.userId }));
        return { message: 'User added to agency' };
    }

    @UseGuards(RolesGuard)
    @Roles('SUPERADMIN')
    @Delete(':id/users/:userId')
    async removeUser(@Param('id', ParseIntPipe) id: number, @Param('userId', ParseIntPipe) userId: number) {
        await firstValueFrom(call(this.agencyService, 'removeUser', { agencyId: id, userId }));
        return { message: 'User removed from agency' };
    }

    @UseGuards(RolesGuard)
    @Roles('SUPERADMIN')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await firstValueFrom(call(this.agencyService, 'delete', { id }));
        return { message: 'Agency deleted successfully' };
    }
}
