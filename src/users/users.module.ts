import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { MessagingService } from '../messaging/messaging.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Register User entity here
  providers: [UsersService, MessagingService],
  controllers: [UsersController],
  exports: [UsersService], // Export if needed by other modules
})
export class UsersModule {}
