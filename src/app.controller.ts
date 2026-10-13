import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome(
    @Req() req: any,
    @Res() res: Response,
  ) {
    if (req.session?.user) {
      return res.render('authenticated', { title: 'Agenda do Dev', user: req.session.user });
    }
    return res.render('home', { title: 'Agenda do Dev' });
  }
}

