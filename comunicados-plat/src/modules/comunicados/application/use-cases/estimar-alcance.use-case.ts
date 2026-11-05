import { Inject, Injectable } from '@nestjs/common';
import { COMUNICADO_REPOSITORY_TOKEN } from '../../infrastructure/tokens.js';
import type { ComunicadoRepositoryPort } from '../../domain/ports/comunicado.repository.port.js';
import { JerarquiaEmisorPolicy } from '../../domain/services/jerarquia-emisor.policy.js';
import type { EstimarAlcanceInput } from '../dtos/comunicado.dto.js';

export interface EstimarAlcanceOutput {
  totalColaboradores: number;
  totalSucursales: number;
  totalDepartamentos: number;
  autorizado: boolean;
  mensajePermiso: string;
}

@Injectable()
export class EstimarAlcanceUseCase {
  constructor(
    @Inject(COMUNICADO_REPOSITORY_TOKEN)
    private readonly repository: ComunicadoRepositoryPort,
  ) {}

  async execute(input: EstimarAlcanceInput): Promise<EstimarAlcanceOutput> {
    const evaluacion = JerarquiaEmisorPolicy.evaluar({
      rolEmisor: input.rolSimulado ?? 'administrador general',
      tipoAlcance: input.tipoAlcance,
    });

    const calculo = await this.repository.estimarAlcance({
      tipoAlcance: input.tipoAlcance,
      sucursalIds: input.sucursalIds,
      departamentoIds: input.departamentoIds,
      usuarioIds: input.usuarioIds,
    });

    return {
      totalColaboradores: calculo.totalColaboradores,
      totalSucursales: calculo.totalSucursales,
      totalDepartamentos: calculo.totalDepartamentos,
      autorizado: evaluacion.autorizado,
      mensajePermiso: evaluacion.mensaje,
    };
  }
}

