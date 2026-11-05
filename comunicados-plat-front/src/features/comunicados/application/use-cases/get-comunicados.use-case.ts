import type { Comunicado } from '../../domain/models/comunicado.model';
import type {
  ComunicadoRepository,
  FilterComunicadosParams,
} from '../../domain/ports/comunicado.repository';

export class GetComunicadosUseCase {
  private readonly repository: ComunicadoRepository;

  constructor(repository: ComunicadoRepository) {
    this.repository = repository;
  }

  async execute(filters?: FilterComunicadosParams): Promise<Comunicado[]> {
    return this.repository.findAll(filters);
  }
}
