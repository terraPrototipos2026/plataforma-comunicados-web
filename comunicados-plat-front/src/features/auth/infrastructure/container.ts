import { LoginUseCase } from '../application/use-cases/login.use-case';
import { LogoutUseCase } from '../application/use-cases/logout.use-case';
import { RefreshSessionUseCase } from '../application/use-cases/refresh-session.use-case';
import { AuthAxiosRepository } from './adapters/auth-axios.repository';

const authRepository = new AuthAxiosRepository();

export const authContainer = {
  repository: authRepository,
  loginUseCase: new LoginUseCase(authRepository),
  logoutUseCase: new LogoutUseCase(authRepository),
  refreshSessionUseCase: new RefreshSessionUseCase(authRepository),
};
