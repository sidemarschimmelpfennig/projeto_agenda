import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const email = createContactDto.email?.trim() || null;
    const phone = createContactDto.phone?.trim() || null;

    // 1. Verifica duplicidade de e-mail para o mesmo usuário
    if (email) {
      const emailExists = await this.contactRepository.findOneBy({
        userId: createContactDto.userId,
        email,
      });
      if (emailExists) {
        throw new ConflictException('Você já possui um contato com este e-mail cadastrado.');
      }
    }

    // 2. Verifica duplicidade de telefone para o mesmo usuário
    if (phone) {
      const phoneExists = await this.contactRepository.findOneBy({
        userId: createContactDto.userId,
        phone,
      });
      if (phoneExists) {
        throw new ConflictException('Você já possui um contato com este telefone cadastrado.');
      }
    }

    const contact = this.contactRepository.create({
      ...createContactDto,
      email: email as any,
      phone: phone as any,
    });
    return await this.contactRepository.save(contact);
  }

  async findAll() {
    return await this.contactRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findAllByUserId(userId: number) {
    return await this.contactRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, userId?: number) {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }
    const contact = await this.contactRepository.findOne({ where });
    if (!contact) {
      throw new NotFoundException('Contato não encontrado.');
    }
    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto, userId?: number) {
    // 1. Localiza o contato e valida propriedade do usuário
    const contact = await this.findOne(id, userId);

    const email =
      updateContactDto.email !== undefined
        ? updateContactDto.email?.trim() || null
        : contact.email;

    const phone =
      updateContactDto.phone !== undefined
        ? updateContactDto.phone?.trim() || null
        : contact.phone;

    // 2. Verifica duplicidade de e-mail ignorando o próprio contato
    if (email) {
      const emailExists = await this.contactRepository.findOne({
        where: {
          userId: contact.userId,
          email,
          id: Not(id),
        },
      });
      if (emailExists) {
        throw new ConflictException('Você já possui um contato com este e-mail cadastrado.');
      }
    }

    // 3. Verifica duplicidade de telefone ignorando o próprio contato
    if (phone) {
      const phoneExists = await this.contactRepository.findOne({
        where: {
          userId: contact.userId,
          phone,
          id: Not(id),
        },
      });
      if (phoneExists) {
        throw new ConflictException('Você já possui um contato com este telefone cadastrado.');
      }
    }

    // 4. Aplica atualizações
    if (updateContactDto.name !== undefined) {
      contact.name = updateContactDto.name.trim();
    }
    if (updateContactDto.lastName !== undefined) {
      contact.lastName = updateContactDto.lastName.trim();
    }
    contact.email = email as any;
    contact.phone = phone as any;

    return await this.contactRepository.save(contact);
  }

  async remove(id: number, userId?: number) {
    const contact = await this.findOne(id, userId);
    await this.contactRepository.delete(contact.id);
    return { success: true, message: 'Contato excluído com sucesso.' };
  }
}
