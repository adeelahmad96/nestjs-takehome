import { Body, Controller, Post, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
