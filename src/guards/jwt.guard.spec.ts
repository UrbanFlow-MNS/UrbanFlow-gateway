import { Mock, vi } from 'vitest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard, JwtPayload } from './jwt.guard';

const buildContext = (authorization?: string) => {
    const request: Record<string, unknown> = { headers: authorization ? { authorization } : {} };
    return {
        request,
        context: {
            switchToHttp: () => ({ getRequest: () => request }),
        } as unknown as ExecutionContext,
    };
};

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;
    let verifyAsync: Mock;

    const payload: JwtPayload = { sub: 1, role: 'ADMIN', typ: 'access' };

    beforeEach(() => {
        verifyAsync = vi.fn();
        guard = new JwtAuthGuard({ verifyAsync } as unknown as JwtService);
        process.env.JWT_SECRET = 'test-secret';
    });

    it('rejects a request without an Authorization header', async () => {
        const { context } = buildContext();

        await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
        expect(verifyAsync).not.toHaveBeenCalled();
    });

    it('rejects a non-Bearer scheme', async () => {
        const { context } = buildContext('Basic dXNlcjpwYXNz');

        await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
        expect(verifyAsync).not.toHaveBeenCalled();
    });

    it('rejects an invalid or expired token', async () => {
        verifyAsync.mockRejectedValue(new Error('jwt expired'));
        const { context } = buildContext('Bearer expired-token');

        await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('rejects a token that is not an access token', async () => {
        verifyAsync.mockResolvedValue({ ...payload, typ: 'refresh' });
        const { context, request } = buildContext('Bearer refresh-token');

        await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
        expect(request.user).toBeUndefined();
    });

    it('accepts a valid access token and attaches the payload to the request', async () => {
        verifyAsync.mockResolvedValue(payload);
        const { context, request } = buildContext('Bearer valid-token');

        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(verifyAsync).toHaveBeenCalledWith('valid-token', {
            secret: 'test-secret',
            algorithms: ['HS256'],
        });
        expect(request.user).toEqual(payload);
    });
});
