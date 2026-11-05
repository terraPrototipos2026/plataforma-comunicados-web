import { AssignPermisosToRolUseCase } from '../application/use-cases/assign-permisos-to-rol.use-case';
import { CreateRolUseCase } from '../application/use-cases/create-rol.use-case';
import { DeleteRolUseCase } from '../application/use-cases/delete-rol.use-case';
import { GetRolesUseCase } from '../application/use-cases/get-roles.use-case';
import { UpdateRolUseCase } from '../application/use-cases/update-rol.use-case';
import { RolAxiosRepository } from './adapters/rol-axios.repository';

const rolRepository = new RolAxiosRepository();

export const rolesContainer = {
  repository: rolRepository,
  getRolesUseCase: new GetRolesUseCase(rolRepository),
  createRolUseCase: new CreateRolUseCase(rolRepository),
  updateRolUseCase: new UpdateRolUseCase(rolRepository),
  assignPermisosToRolUseCase: new AssignPermisosToRolUseCase(rolRepository),
  deleteRolUseCase: new DeleteRolUseCase(rolRepository),
};

