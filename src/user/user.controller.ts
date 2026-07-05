import { Body, Controller, Delete, ForbiddenException, Get, Inject, OnModuleInit, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { CurrentUser } from "../decorators/current-user.decorator";
import { JwtAuthGuard, JwtPayload } from "../guards/jwt.guard";
import { USER_SERVICE_NAME, UserServiceClient } from "../../../proto/generated/typescript/user";

@Controller('user')
export class UserController implements OnModuleInit {
    private userService!: UserServiceClient;

    constructor(@Inject('USER_PACKAGE') private readonly userClient: ClientGrpc) { }

    onModuleInit() {
        this.userService = this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    @UseGuards(JwtAuthGuard)
    @Get('info/:id')
    async getUserInfo(@Param('id', ParseIntPipe) id: number) {
        const res = await firstValueFrom(this.userService.findOneById({ id }));
        return res.user ?? null;
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
        await firstValueFrom(this.userService.updatePassword({ id, newPassword }));
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
        await firstValueFrom(this.userService.deleteUser({ id }));
        return { message: 'User deleted successfully' };
    }
}
