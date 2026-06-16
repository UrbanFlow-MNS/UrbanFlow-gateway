import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) { }

    @Post('signUp')
    signUp(@Body() body: any): Observable<any> {
        console.log("AUTH CONTROLLEZR GATEWAY SENT")
        return this.authClient.send({ cmd: 'auth.signUp' }, body)
    }

    @Post('signIn')
    signIn(@Body() body: any): Observable<any> {
        return this.authClient.send({ cmd: 'auth.signIn' }, body)
    }

    @Get('refreshToken/:refreshToken')
    refreshToken(@Param('refreshToken') refreshToken: string): Observable<any> {
        return this.authClient.send({ cmd: 'auth.refreshToken' }, refreshToken)
    }

    @Post('forgot-password/:email')
    forgotPassword(@Param('email') email: string): Observable<any> {
        return this.authClient.send({ cmd: 'auth.forgotPassword' }, email)
    }

}