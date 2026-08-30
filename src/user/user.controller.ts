import { Body, Controller, Delete, ForbiddenException, Get, Inject, NotFoundException, OnModuleInit, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Metadata } from "@grpc/grpc-js";
import { firstValueFrom, Observable } from "rxjs";
import { CurrentUser } from "../decorators/current-user.decorator";
import { JwtAuthGuard, JwtPayload } from "../guards/jwt.guard";
import { USER_SERVICE_NAME, UserServiceClient } from "../../../proto/generated/typescript/user";

function userMeta(): Metadata {
    const meta = new Metadata();
    meta.add("x-internal-secret", process.env.USER_INTERNAL_SECRET ?? "");
    return meta;
}

function callUser<T>(client: UserServiceClient, method: keyof UserServiceClient, request: unknown): Observable<T> {
    const fn = client[method] as unknown as (req: unknown, meta: Metadata) => Observable<T>;
    return fn.call(client, request, userMeta());
}

@Controller('user')
export class UserController implements OnModuleInit {
    private userService!: UserServiceClient;

    constructor(@Inject('USER_PACKAGE') private readonly userClient: ClientGrpc) { }

    onModuleInit() {
        this.userService = this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@CurrentUser() user: JwtPayload) {
        const res = await firstValueFrom(callUser<{ user?: any }>(this.userService, "findOneById", { id: user.sub }));
        if (!res.user) throw new NotFoundException('User not found');
        const { refreshToken, ...safe } = res.user;
        return safe;
    }

    @UseGuards(JwtAuthGuard)
    @Get('info/:id')
    async getUserInfo(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtPayload,
    ) {
        const isAdmin = ['SUPERADMIN', 'ADMIN_USER_CITY'].includes(user.role);
        if (user.sub !== id && !isAdmin) {
            throw new ForbiddenException('You can only view your own info');
        }
        const res = await firstValueFrom(callUser<{ user?: any }>(this.userService, "findOneById", { id }));
        if (!res.user) return null;
        const { refreshToken, ...safe } = res.user;
        return safe;
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/password')
    async updatePassword(
        @Param('id', ParseIntPipe) id: number,
        @Body('newPassword') newPassword: string,
        @CurrentUser() user: JwtPayload,
    ) {
        if (user.sub !== id) {
            throw new ForbiddenException('You can only update your own password');
        }
        await firstValueFrom(callUser(this.userService, "updatePassword", { id, newPassword, callerId: user.sub, callerRole: user.role }));
        return { message: 'Password updated successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtPayload,
    ) {
        if (user.sub !== id) {
            throw new ForbiddenException('You can only delete your own account');
        }
        await firstValueFrom(callUser(this.userService, "deleteUser", { id }));
        return { message: 'User deleted successfully' };
    }
}
