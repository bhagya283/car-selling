import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    async submit(@Body() createContactDto: any) {
        return this.contactsService.create(createContactDto);
    }

    @Get()
    async findAll() {
        return this.contactsService.findAll();
    }

    @Put(':id/contacted')
    async markContacted(@Param('id') id: string) {
        return this.contactsService.markAsContacted(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.contactsService.remove(id);
    }
}
