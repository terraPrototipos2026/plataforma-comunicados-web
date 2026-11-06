import { Global, Module } from '@nestjs/common';
import { FirebaseMessagingProvider } from './firebase.provider.js';

@Global()
@Module({
  providers: [FirebaseMessagingProvider],
  exports: [FirebaseMessagingProvider],
})
export class FirebaseModule {}

