import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'defaultSecretKey';
      const decoded = this.jwtService.verify(token, { secret });

      if (!decoded.role || (!requiredRoles.includes(decoded.role) && decoded.role !== 'ADMIN')) {
        throw new ForbiddenException('You do not have permission to access this resource');
      }
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
