import type {
  ComunicadoRepository,
  EstimarAlcanceParams,
  EstimarAlcanceResult,
} from '../../domain/ports/comunicado.repository';

export class EstimarAlcanceUseCase {
  private readonly repository: ComunicadoRepository;

  constructor(repository: ComunicadoRepository) {
    this.repository = repository;
  }

  async execute(params: EstimarAlcanceParams): Promise<EstimarAlcanceResult> {
    return this.repository.estimarAlcance(params);
  }
}
