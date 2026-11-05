import { UsuarioAxiosRepository } from './adapters/usuario-axios.repository';
import { GetUsuariosUseCase } from '../application/use-cases/get-usuarios.use-case';
import { RegisterUsuarioUseCase } from '../application/use-cases/register-usuario.use-case';
import { UpdateUsuarioUseCase } from '../application/use-cases/update-usuario.use-case';
import { DeleteUsuarioUseCase } from '../application/use-cases/delete-usuario.use-case';

const repository = new UsuarioAxiosRepository();

export const usuariosContainer = {
  repository,
  getUsuariosUseCase: new GetUsuariosUseCase(repository),
  registerUsuarioUseCase: new RegisterUsuarioUseCase(repository),
  updateUsuarioUseCase: new UpdateUsuarioUseCase(repository),
  deleteUsuarioUseCase: new DeleteUsuarioUseCase(repository),
};

