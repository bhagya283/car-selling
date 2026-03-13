import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}
  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.usersService.create({ ...userData, password: hashedPassword });
  }
  async login(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { sub: user._id, role: user.role };
      return { access_token: this.jwtService.sign(payload), user };
    }
    throw new UnauthorizedException();
  }
}
