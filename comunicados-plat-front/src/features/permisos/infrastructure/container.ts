import { CreatePermisoUseCase } from '../application/use-cases/create-permiso.use-case';
import { DeletePermisoUseCase } from '../application/use-cases/delete-permiso.use-case';
import { GetPermisosUseCase } from '../application/use-cases/get-permisos.use-case';
import { UpdatePermisoUseCase } from '../application/use-cases/update-permiso.use-case';
import { PermisoAxiosRepository } from './adapters/permiso-axios.repository';

const permisoRepository = new PermisoAxiosRepository();

export const permisosContainer = {
  repository: permisoRepository,
  getPermisosUseCase: new GetPermisosUseCase(permisoRepository),
  createPermisoUseCase: new CreatePermisoUseCase(permisoRepository),
  updatePermisoUseCase: new UpdatePermisoUseCase(permisoRepository),
  deletePermisoUseCase: new DeletePermisoUseCase(permisoRepository),
};

