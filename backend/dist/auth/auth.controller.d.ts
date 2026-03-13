import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<import("mongoose").Document<unknown, {}, import("../users/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("../users/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    login(body: any): Promise<{
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
