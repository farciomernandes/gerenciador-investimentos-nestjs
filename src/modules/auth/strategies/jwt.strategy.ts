import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'JwtStrategy') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<any> {
    return {
      id: payload.id,
      roles: payload.roles,
    };
  }

  async authenticate(req) {
    const token = req.headers.authorization;
    if (!token) {
      return this.fail('Unauthorized', 401);
    }
  }
}
