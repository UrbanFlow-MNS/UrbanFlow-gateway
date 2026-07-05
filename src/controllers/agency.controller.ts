import { Body, Controller, Delete, Get, Inject, NotFoundException, OnModuleInit, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AgencyServiceClient } from '../../../proto/generated/typescript/user';

const AGENCY_SERVICE_NAME = 'AgencyService';

@UseGuards(JwtAuthGuard)
@Controller('agency')
export class AgencyController implements OnModuleInit {
    private agencyService!: AgencyServiceClient;

    constructor(@Inject('AGENCY_PACKAGE') private readonly agencyClient: ClientGrpc) { }

    onModuleInit() {
        this.agencyService = this.agencyClient.getService<AgencyServiceClient>(AGENCY_SERVICE_NAME);
    }

    @Get()
    async findAll() {
        const res = await firstValueFrom(this.agencyService.findAll({}));
        return res.agencies ?? [];
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const res = await firstValueFrom(this.agencyService.findOne({ id }));
        if (!res.agency) throw new NotFoundException('Agency not found');
        return res.agency;
    }

    @UseGuards(RolesGuard)
    @Roles('SUPERADMIN')
    @Post()
    async create(@Body() body: any, @Req() req: Request) {
        const { id: callerId } = req['user'];
        return await firstValueFrom(this.agencyService.create({ city: body.city, callerId }));
    }

    @UseGuards(RolesGuard)
    @Roles('SUPERADMIN', 'ADMIN_USER_CITY')
    @Post(':id/users')
    async addUser(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
        await firstValueFrom(this.agencyService.addUser({ agencyId: id, userId: body.userId }));
        return { message: 'User added to agency' };
    }

    @UseGuards(RolesGuard)
    @Roles('SUPERADMIN')
    @Delete(':id/users/:userId')
    async removeUser(@Param('id', ParseIntPipe) id: number, @Param('userId', ParseIntPipe) userId: number) {
        await firstValueFrom(this.agencyService.removeUser({ agencyId: id, userId }));
        return { message: 'User removed from agency' };
    }

    @UseGuards(RolesGuard)
    @Roles('SUPERADMIN')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await firstValueFrom(this.agencyService.delete({ id }));
        return { message: 'Agency deleted successfully' };
    }
}
