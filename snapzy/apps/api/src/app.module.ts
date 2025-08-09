import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TODO: import AuthModule, UsersModule, PostsModule, MediaModule, MessagesModule, GraphQLModule
  ],
})
export class AppModule {}