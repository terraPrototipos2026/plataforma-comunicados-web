import { GetComunicadosUseCase } from '../application/use-cases/get-comunicados.use-case';
import { CreateComunicadoUseCase } from '../application/use-cases/create-comunicado.use-case';
import { EstimarAlcanceUseCase } from '../application/use-cases/estimar-alcance.use-case';
import { RegistrarLecturaUseCase } from '../application/use-cases/registrar-lectura.use-case';
import { AnularComunicadoUseCase } from '../application/use-cases/anular-comunicado.use-case';
import { ComunicadoAxiosRepository } from './adapters/comunicado-axios.repository';

const comunicadoRepository = new ComunicadoAxiosRepository();

export const comunicadosContainer = {
  repository: comunicadoRepository,
  getComunicadosUseCase: new GetComunicadosUseCase(comunicadoRepository),
  createComunicadoUseCase: new CreateComunicadoUseCase(comunicadoRepository),
  estimarAlcanceUseCase: new EstimarAlcanceUseCase(comunicadoRepository),
  registrarLecturaUseCase: new RegistrarLecturaUseCase(comunicadoRepository),
  anularComunicadoUseCase: new AnularComunicadoUseCase(comunicadoRepository),
};

