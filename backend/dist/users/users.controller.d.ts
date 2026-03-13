import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    deleteUser(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updateUser(id: string, updateData: any): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("./user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    changePassword(id: string, body: any): Promise<{
        message: string;
    }>;
}
