import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(userData: any): Promise<import("mongoose").Document<unknown, {}, import("../users/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    login(email: string, pass: string): Promise<{
        access_token: string;
        user: import("mongoose").Document<unknown, {}, import("../users/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/user.schema").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
