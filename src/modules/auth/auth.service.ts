import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User  } from '../users/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Regista um novo utilizador cifrando a palavra-passe
   */
  async register(authCredentialsDto: AuthCredentialsDto): Promise<Omit<User, 'password'>> {
    const { email, password, name } = authCredentialsDto;

    // Verifica se o utilizador já existe
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Usuário existente.');
    }

    // Gera o hash com salt da palavra-passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria e guarda a nova entidade
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    const savedUser = await this.userRepository.save(user);

    // Remove a hash do retorno por segurança
    const { password: _, ...result } = savedUser;
    return result as Omit<User, 'password'>;
  }

  /**
   * Valida credenciais e autentica o utilizador
   */
  async login(authCredentialsDto: AuthCredentialsDto): Promise<Omit<User, 'password'>> {
    const { email, password } = authCredentialsDto;

    // Busca o utilizador incluindo a coluna de palavra-passe (select: false)
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Usuário não existe.');
    }

    // Compara a palavra-passe fornecida com o hash guardado
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida.');
    }

    // Retorna os dados do utilizador sem a palavra-passe
    const { password: _, ...result } = user;
    return result as Omit<User, 'password'>;
  }
}