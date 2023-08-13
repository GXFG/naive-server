import { ConfigModule } from '@nestjs/config';

export default function configGenerator() {
  const mode = process.env.NODE_ENV || 'production';
  const envFilePath = mode === 'production' ? ['.env.production', '.env.base'] : ['.env.development', '.env.base'];

  return ConfigModule.forRoot({
    isGlobal: true,
    envFilePath,
  });
}
