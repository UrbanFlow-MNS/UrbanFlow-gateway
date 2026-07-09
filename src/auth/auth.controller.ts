import { Body, Controller, ForbiddenException, Get, Headers, Inject, Param, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Throttle } from "@nestjs/throttler";
import { Observable } from "rxjs";

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) { }

    @Throttle({ short: { limit: 3, ttl: 60000 } })
    @Post('signUp')
    signUp(
        @Body() body: any,
        @Headers('x-superadmin-key') superadminKey?: string,
    ): Observable<any> {
        if (body.role === 'SUPERADMIN') {
            const expectedKey = process.env.SUPERADMIN_API_KEY;
            if (!expectedKey || superadminKey !== expectedKey) {
                throw new ForbiddenException('Invalid or missing superadmin key');
            }
        }
        return this.authClient.send({ cmd: 'auth.signUp' }, body)
    }

    @Throttle({ short: { limit: 5, ttl: 60000 } })
    @Post('signIn')
    signIn(@Body() body: any): Observable<any> {
        return this.authClient.send({ cmd: 'auth.signIn' }, body)
    }

    @Throttle({ short: { limit: 10, ttl: 60000 } })
    @Get('refreshToken/:refreshToken')
    refreshToken(@Param('refreshToken') refreshToken: string): Observable<any> {
        return this.authClient.send({ cmd: 'auth.refreshToken' }, refreshToken)
    }

    @Throttle({ short: { limit: 3, ttl: 300000 } })
    @Post('forgot-password/:email')
    forgotPassword(@Param('email') email: string): Observable<any> {
        return this.authClient.send({ cmd: 'auth.forgotPassword' }, email)
    }

}