import { CreateSucursalUseCase } from '../application/use-cases/create-sucursal.use-case';
import { DeleteSucursalUseCase } from '../application/use-cases/delete-sucursal.use-case';
import { GetSucursalesUseCase } from '../application/use-cases/get-sucursales.use-case';
import { UpdateSucursalUseCase } from '../application/use-cases/update-sucursal.use-case';
import { SucursalAxiosRepository } from './adapters/sucursal-axios.repository';

const sucursalRepository = new SucursalAxiosRepository();

export const sucursalesContainer = {
  repository: sucursalRepository,
  getSucursalesUseCase: new GetSucursalesUseCase(sucursalRepository),
  createSucursalUseCase: new CreateSucursalUseCase(sucursalRepository),
  updateSucursalUseCase: new UpdateSucursalUseCase(sucursalRepository),
  deleteSucursalUseCase: new DeleteSucursalUseCase(sucursalRepository),
};

