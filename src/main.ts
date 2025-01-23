import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(5001);
    console.log('Application is running on: http://localhost:5001');
  } catch (error) {
    console.error('Error starting application:', error);
  }
}
bootstrap();