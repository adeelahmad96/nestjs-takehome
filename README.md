# NestJS Take-Home Test

This project is a NestJS application designed to demonstrate essential skills in building REST APIs, working with databases, integrating message queues, and applying performance and security best practices. Each task is broken down step-by-step to make it easy to follow along.

## Table of Contents
1. [Project Setup](#project-setup)
2. [Tasks](#tasks)
   - [Task 1: RESTful API with NestJS](#task-1-restful-api-with-nestjs)
   - [Task 2: Database Schema and Optimization](#task-2-database-schema-and-optimization)
   - [Task 3: Message Queue Integration](#task-3-message-queue-integration)
   - [Task 4: API Performance and Security](#task-4-api-performance-and-security)
3. [Testing the Endpoints](#testing-the-endpoints)

---

## Project Setup

Follow these steps to set up the project:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd nestjs-takehome
   ```

2. **Install Dependencies**:
   Run this command to install the required packages.
   ```bash
   npm install
   ```

3. **Set Up PostgreSQL Database**:
   - Open PostgreSQL from your terminal:
     ```bash
     sudo -u postgres psql
     ```
   - Create a new database named `nestjsdb`:
     ```sql
     CREATE DATABASE nestjsdb;
     ```
   - Exit PostgreSQL with `\q`.

4. **Install RabbitMQ**:
   - Download and start RabbitMQ by following the official [RabbitMQ Installation Guide](https://www.rabbitmq.com/download.html).

5. **Run the Application**:
   Start the NestJS application:
   ```bash
   npm run start
   ```

---

## Tasks

### Task 1: RESTful API with NestJS

**Objective**: Create a basic API with one endpoint (`/users`) that allows adding and retrieving user data.

1. **Generate the Users Module, Service, and Controller**:
   Use NestJS CLI commands to scaffold the files:
   ```bash
   nest generate module users
   nest generate service users
   nest generate controller users
   ```

2. **Define the User Entity**:
   Create a `User` entity with the necessary fields for user data (`userId`, `name`, `email`, `age`). In `src/users/user.entity.ts`, add:
   ```typescript
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

   @Entity()
   export class User {
     @PrimaryGeneratedColumn()
     userId: number;

     @Column()
     name: string;

     @Column()
     email: string;

     @Column()
     age: number;
   }
   ```

3. **Configure Database Connection**:
   - Install TypeORM and PostgreSQL packages:
     ```bash
     npm install @nestjs/typeorm typeorm pg
     ```
   - In `app.module.ts`, add TypeORM configuration to connect to PostgreSQL:
     ```typescript
     import { TypeOrmModule } from '@nestjs/typeorm';
     import { User } from './users/user.entity';

     @Module({
       imports: [
         TypeOrmModule.forRoot({
           type: 'postgres',
           host: 'localhost',
           port: 5432,
           username: 'postgres',
           password: 'password',
           database: 'nestjsdb',
           entities: [User],
           synchronize: true,
         }),
         UsersModule,
       ],
     })
     ```

4. **Implement the `/users` Endpoint**:
   - **POST /users**: Accepts user data and saves it to the database.
   - **GET /users**: Retrieves all users from the database.
   - In `src/users/users.controller.ts`, add methods for each endpoint:
     ```typescript
     import { Controller, Get, Post, Body } from '@nestjs/common';
     import { UsersService } from './users.service';
     import { User } from './user.entity';

     @Controller('users')
     export class UsersController {
       constructor(private readonly usersService: UsersService) {}

       @Post()
       async createUser(@Body() userData: Partial<User>): Promise<User> {
         return this.usersService.create(userData);
       }

       @Get()
       async getUsers(): Promise<User[]> {
         return this.usersService.findAll();
       }
     }
     ```

---

### Task 2: Database Schema and Optimization

**Objective**: Design an optimized schema for storing user data and write an efficient query to retrieve it.

1. **Design Database Schema**:
   The `User` entity you created in Task 1 serves as the database schema. It includes fields for `userId`, `name`, `email`, and `age`.

2. **Write the Query**:
   - The goal is to retrieve users over the age of 18, sorted by name.
   - Here’s the SQL query for this:
     ```sql
     SELECT * FROM "user" WHERE age > 18 ORDER BY name ASC;
     ```

3. **Optimize with Indexes**:
   - Indexing can help speed up the query, especially for sorting and filtering fields.
   - In `user.entity.ts`, add indexes on `age` and `name`:
     ```typescript
     import { Index, Entity, Column } from 'typeorm';

     @Entity()
     @Index("idx_user_age", ["age"])
     @Index("idx_user_name", ["name"])
     ```

---

### Task 3: Message Queue Integration

**Objective**: Set up a message queue using RabbitMQ to send a welcome message to new users.

1. **Install RabbitMQ Dependencies**:
   ```bash
   npm install amqp-connection-manager amqplib
   ```

2. **Create the Messaging Service**:
   - Set up RabbitMQ to send a welcome message.
   - In `src/messaging/messaging.service.ts`:
     ```typescript
     import { Injectable } from '@nestjs/common';
     import * as amqp from 'amqp-connection-manager';

     @Injectable()
     export class MessagingService {
       private connection = amqp.connect(['amqp://localhost']);
       private channelWrapper = this.connection.createChannel({
         json: true,
         setup: channel => channel.assertQueue('welcome_queue', { durable: true }),
       });

       sendWelcomeMessage(message: string) {
         this.channelWrapper.sendToQueue('welcome_queue', Buffer.from(message));
       }
     }
     ```

3. **Integrate Messaging with User Creation**:
   - In `UsersService`, send a welcome message when a new user is created.
   ```typescript
   async create(user: Partial<User>): Promise<User> {
     const newUser = this.usersRepository.create(user);
     const savedUser = await this.usersRepository.save(newUser);
     this.messagingService.sendWelcomeMessage(`Welcome, ${savedUser.name}!`);
     return savedUser;
   }
   ```

---

### Task 4: API Performance and Security

**Objective**: Optimize the API for better performance and add security measures.

1. **Performance Optimizations**:
   - **Caching**: Use Redis or similar caching for frequently accessed data.
   - **Pagination**: Add pagination to `GET /users` to handle large numbers of users.
   - **Indexing**: Ensure indexes are in place on `age` and `name` to speed up queries.

2. **Security Measures**:
   - **Input Validation**: Use validation pipes in NestJS to ensure correct data format.
   - **Rate Limiting**: Protect against abuse by limiting requests per user.
   - **Authentication**: Secure endpoints using JWTs or similar authentication.
   - **Sanitization**: Prevent SQL injection and XSS by sanitizing inputs.

---

## Testing the Endpoints

Here are examples for testing the endpoints after completing the tasks.

### POST /users
To add a new user:
```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 25
}'
```

### GET /users
To retrieve all users:
```bash
curl -X GET http://localhost:3000/users
```

---

This guide provides a step-by-step approach to each task, making it easy to follow and implement the project.