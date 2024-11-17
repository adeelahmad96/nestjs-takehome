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
