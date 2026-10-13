import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Render, Req, Res } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import type { Response } from 'express';

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('/create')
  @Render('pages/contacts/create')
  create_render() {
    return { contact: new CreateContactDto(), title: 'Criar Contato' };
  }

  @Post()
  async create(
    @Body() createContactDto: CreateContactDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      if (req.session?.user?.id) {
        createContactDto.userId = req.session.user.id;
      }
      await this.contactsService.create(createContactDto);
      return res.redirect('/contacts');
    } catch (error: any) {
      console.error(error);
      return res.render('pages/contacts/create', {
        title: 'Criar Contato',
        contact: createContactDto,
        error: error.message,
      });
    }
  }

  @Get()
  @Render('pages/contacts/list')
  async findAll(@Req() req: any) {
    const contacts = await this.contactsService.findAllByUserId(req.session.user.id);
    return { contacts, title: 'Meus Contatos' };
  }

  @Get('edit/:id')
  async edit_render(@Param('id') id: string, @Req() req: any, @Res() res: Response) {
    try {
      const userId = req.session?.user?.id;
      const contact = await this.contactsService.findOne(+id, userId);
      return res.render('pages/contacts/edit', { contact, title: 'Editar Contato' });
    } catch (error) {
      return res.redirect('/contacts');
    }
  }

  @Post('edit/:id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const userId = req.session?.user?.id;
      await this.contactsService.update(+id, updateContactDto, userId);
      return res.redirect('/contacts');
    } catch (error: any) {
      console.error(error);
      const contact = { id: +id, ...updateContactDto };
      return res.render('pages/contacts/edit', {
        title: 'Editar Contato',
        contact,
        error: error.message,
      });
    }
  }

  @Get('delete/:id')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any, @Res() res: Response) {
    try {
      const userId = req.session?.user?.id;
      await this.contactsService.remove(+id, userId);
    } catch (error: any) {
      console.error(error);
    }
    return res.redirect('/contacts');
  }
}
