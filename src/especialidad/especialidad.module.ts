import { Module } from '@nestjs/common';
import { EspecialidadResolver } from './especialidad.resolver';

@Module({
  providers: [EspecialidadResolver]
})
export class EspecialidadModule {}
