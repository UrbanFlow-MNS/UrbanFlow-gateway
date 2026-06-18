import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { CurrentUser } from "../decorators/current-user.decorator";
import { JwtAuthGuard, JwtPayload } from "../guards/jwt.guard";

@Controller('user')
export class UserController {
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) { }

    @UseGuards(JwtAuthGuard)
    @Get('info/:id')
    getUserInfo(@Param('id', ParseIntPipe) id: number): Observable<any> {
        return this.userClient.send({ cmd: 'user.findOne' }, { id });
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/password')
    updatePassword(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
        @CurrentUser() user: JwtPayload,
    ): Observable<any> {
        if (user.sub !== id) {
            throw new ForbiddenException('You can only update your own password');
        }
        return this.userClient.send({ cmd: 'user.updatePassword' }, { id, body });
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteUser(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtPayload,
    ): Observable<any> {
        if (user.sub !== id) {
            throw new ForbiddenException('You can only delete your own account');
        }
        return this.userClient.send({ cmd: 'user.deleteUser' }, { id });
    }
}
