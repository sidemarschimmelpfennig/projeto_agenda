import { Controller, Get, Post, Body, Render, Res, Req } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('pages/auth/login')
  getLogin() {
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
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.login(authCredentialsDto);
      if (req.session) {
        req.session.user = user;
        return req.session.save(() => {
          res.redirect('/');
        });
      }
      return res.redirect('/');
    } catch (error: any) {
      return res.render('pages/auth/login', {
        title: 'Entrar',
        error: error.message,
      });
    }
  }

  @Get('logout')
  @Post('logout')
  logout(@Req() req: any, @Res() res: Response) {
    if (req.session) {
      return req.session.destroy(() => {
        res.redirect('/auth/login');
      });
    }
    return res.redirect('/auth/login');
  }
}