import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `App has been running for ${process.uptime()} seconds.`;
  }
}
