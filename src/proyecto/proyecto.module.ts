import { Module } from '@nestjs/common';
import { ProyectoResolver } from './proyecto.resolver';

@Module({
  providers: [ProyectoResolver]
})
export class ProyectoModule {}
