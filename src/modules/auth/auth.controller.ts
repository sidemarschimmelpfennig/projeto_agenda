import { Controller, Get, Post, Body, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('pages/auth/login')
  getLogin() {
    // Retorne um objeto com variáveis ou simplesmente {}
    return { title: 'Entrar' };
  }

  @Get('register')
  @Render('pages/auth/register')
  getRegister() {
    return { title: 'Criar Conta' };
  }

  @Post('register')
  async register(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ) {
    try {
      await this.authService.register(authCredentialsDto);
      return res.redirect('/auth/login');
    } catch (error: any) {
      return res.render('pages/auth/register', {
        title: 'Criar Conta',
        error: error.message,
      });
    }
  }

  @Post('login')
  async login(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.login(authCredentialsDto);
      // Aqui você salvará a sessão (req.session.user = user) ou cookie
      return res.redirect('/');
    } catch (error: any) {
      return res.render('pages/auth/login', {
        title: 'Entrar',
        error: error.message,
      });
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    // Destruir sessão/limpar cookie quando implementar sessões
    return res.redirect('/auth/login');
  }
}