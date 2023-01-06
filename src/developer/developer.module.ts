import { Module } from '@nestjs/common';
import { DeveloperResolver } from './developer.resolver';

@Module({
  providers: [DeveloperResolver]
})
export class DeveloperModule {}
