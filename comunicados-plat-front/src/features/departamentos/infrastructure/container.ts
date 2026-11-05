import { CreateDepartamentoUseCase } from '../application/use-cases/create-departamento.use-case';
import { DeleteDepartamentoUseCase } from '../application/use-cases/delete-departamento.use-case';
import { GetDepartamentosUseCase } from '../application/use-cases/get-departamentos.use-case';
import { UpdateDepartamentoUseCase } from '../application/use-cases/update-departamento.use-case';
import { DepartamentoAxiosRepository } from './adapters/departamento-axios.repository';

const departamentoRepository = new DepartamentoAxiosRepository();

export const departamentosContainer = {
  repository: departamentoRepository,
  getDepartamentosUseCase: new GetDepartamentosUseCase(departamentoRepository),
  createDepartamentoUseCase: new CreateDepartamentoUseCase(departamentoRepository),
  updateDepartamentoUseCase: new UpdateDepartamentoUseCase(departamentoRepository),
  deleteDepartamentoUseCase: new DeleteDepartamentoUseCase(departamentoRepository),
};

