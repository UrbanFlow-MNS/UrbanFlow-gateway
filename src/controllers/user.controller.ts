import { Body, Controller, Inject, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Controller('user')
export class UserController {
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) { }

    // TODO: Need a valide token and id in token correspond to id in url
    @Post(':id/password')
    updatePassword(@Param('id', ParseIntPipe) id: number, @Body() body: any): Observable<any> {
        return this.userClient.send({ cmd: 'user.updatePassword' }, { id, body })
    }
    
}