// src/main.ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { AppModule } from './app.module';
import { CsrfFilter } from './common/filters/csrf.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // 1. Parser de cookies (obrigatório para csurf com cookie)
  app.use(cookieParser());

  // 2. Middleware que gera e valida CSRF
  app.use(csurf({ cookie: true }));

  // 3. Middleware para passar o token para todas as views EJS automaticamente
  app.use((req: any, res: any, next: any) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });

  // 4. Exception Filter que substitui o antigo "checkCsrf"
  app.useGlobalFilters(new CsrfFilter());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();