import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MessagingService } from '../messaging/messaging.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private messagingService: MessagingService,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    const savedUser = await this.usersRepository.save(newUser);
    
    // Send welcome message to the queue
    this.messagingService.sendWelcomeMessage(`Welcome, ${savedUser.name}!`);
    return savedUser;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
    // query to retrieve all users over the age of 18, sorted by name in ascending order
    return this.usersRepository.query(`SELECT * FROM "user" WHERE age > 18 ORDER BY name ASC;
    `)
  }
}
