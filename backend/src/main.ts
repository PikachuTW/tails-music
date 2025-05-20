import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';
import secureSession from '@fastify/secure-session';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: ['error', 'warn', 'log', 'debug', 'verbose', 'fatal'],
    },
  );
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.register(fastifyHelmet);
  const configService = app.get(ConfigService);
  await app.register(secureSession, {
    key: Buffer.from(configService.getOrThrow<string>('SESSION_KEY'), 'base64url'),
    cookie: {
      path: '/',
      httpOnly: true,
      secure: configService.get<string>('NODE_ENV') === 'production',
    },
  });
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
