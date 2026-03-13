import { Controller, Get, Delete, Param, Patch, Body, Post, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getAllUsers() {
        return this.usersService.findAll();
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() updateData: any) {
        return this.usersService.update(id, updateData);
    }

    @Post(':id/change-password')
    async changePassword(@Param('id') id: string, @Body() body: any) {
        const { oldPassword, newPassword } = body;
        const user = await this.usersService.findById(id);

        if (!user) throw new UnauthorizedException('User not found');

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid old password');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await this.usersService.updatePassword(id, hashedPassword);
        return { message: 'Password updated successfully' };
    }
}
