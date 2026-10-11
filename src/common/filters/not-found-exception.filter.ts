// src/common/filters/not-found-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  NotFoundException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Renderiza a view views/404.ejs enviando status HTTP 404
    response.status(HttpStatus.NOT_FOUND).render('404', {
      title: 'Página Não Encontrada',
      message: 'O link que você tentou acessar não existe ou foi removido.',
    });
  }
}