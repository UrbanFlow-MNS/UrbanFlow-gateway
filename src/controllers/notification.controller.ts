import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Controller('notifications')
export class NotificationController {
    constructor(@Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy) { }

    @Post()
    create(@Body() body: any): Observable<any> {
        return this.notificationClient.send({ cmd: 'notifications.create' }, body)
    }

    @Get()
    findAll(): Observable<any> {
        return this.notificationClient.send({ cmd: 'notifications.findAll' }, {})
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string): Observable<any> {
        return this.notificationClient.send({ cmd: 'notifications.findByUser' }, userId)
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<any> {
        return this.notificationClient.send({ cmd: 'notifications.findOne' }, id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any): Observable<any> {
        return this.notificationClient.send({ cmd: 'notifications.update' }, { id, ...body })
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Observable<any> {
        return this.notificationClient.send({ cmd: 'notifications.remove' }, id)
    }

    @Post('send-email')
    sendEmail(@Body() body: any): Observable<any> {
        return this.notificationClient.send({ cmd: 'notifications.sendEmail' }, body)
    }
}
