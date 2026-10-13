// src/main.ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import csurf from 'csurf';
import expressLayouts from 'express-ejs-layouts';
import { AppModule } from './app.module';
import { CsrfFilter } from './common/filters/csrf.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.use(expressLayouts);
  app.set('layout', false); // Suporta layouts dinâmicos (layout/generic.layout ou layout/auth.layout)

  // 1. Processa o corpo da requisição antes do csurf (necessário para ler req.body._csrf)
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // 2. Parser de cookies
  app.use(cookieParser());

  // 3. Sessão de usuário
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'agenda-dev-secret-key-123',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        httpOnly: true,
      },
    }),
  );

  // 4. Middleware que gera e valida CSRF
  app.use(csurf({ cookie: true }));

  // 5. Middleware para passar token e usuário para todas as views EJS automaticamente
  app.use((req: any, res: any, next: any) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.user = req.session?.user;
    next();
  });

  // 6. Exception Filter que substitui o antigo "checkCsrf"
  app.useGlobalFilters(new CsrfFilter());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();