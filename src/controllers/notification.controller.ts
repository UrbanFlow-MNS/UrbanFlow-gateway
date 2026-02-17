import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Controller('notifications')
export class NotificationController {
    constructor(@Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy) { }

    @Get()
    findAll(): Observable<any> {
        return this.notificationClient.send({ cmd: 'notifications.findAll' }, {})
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string): Observable<any> {
        return this.notificationClient.send({ cmd: 'notifications.findByUser' }, userId)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Observable<any> {
        return this.notificationClient.send({ cmd: 'notifications.remove' }, id)
    }
}
