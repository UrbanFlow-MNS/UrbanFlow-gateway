import { Mock, vi } from 'vitest';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

const buildContext = (user?: { role: string }) =>
    ({
        getHandler: () => 'handler',
        getClass: () => 'class',
        switchToHttp: () => ({ getRequest: () => ({ user }) }),
    }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
    let guard: RolesGuard;
    let getAllAndOverride: Mock;

    beforeEach(() => {
        getAllAndOverride = vi.fn();
        guard = new RolesGuard({ getAllAndOverride } as unknown as Reflector);
    });

    it('allows a route without @Roles metadata', () => {
        getAllAndOverride.mockReturnValue(undefined);

        expect(guard.canActivate(buildContext({ role: 'CLASSIC_USER' }))).toBe(true);
        expect(getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, ['handler', 'class']);
    });

    it('allows a route with an empty @Roles list', () => {
        getAllAndOverride.mockReturnValue([]);

        expect(guard.canActivate(buildContext())).toBe(true);
    });

    it('denies an unauthenticated request on a protected route', () => {
        getAllAndOverride.mockReturnValue(['ADMIN']);

        expect(() => guard.canActivate(buildContext())).toThrow(ForbiddenException);
    });

    it('denies a user whose role is not allowed', () => {
        getAllAndOverride.mockReturnValue(['ADMIN']);

        expect(() => guard.canActivate(buildContext({ role: 'CLASSIC_USER' }))).toThrow(ForbiddenException);
    });

    it('allows a user whose role is in the required list', () => {
        getAllAndOverride.mockReturnValue(['ADMIN', 'AGENCY_MANAGER']);

        expect(guard.canActivate(buildContext({ role: 'AGENCY_MANAGER' }))).toBe(true);
    });
});
