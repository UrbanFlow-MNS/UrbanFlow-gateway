import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! From CI/CD again again ? Ok now its good ... PLEASE ?';
  }
}
