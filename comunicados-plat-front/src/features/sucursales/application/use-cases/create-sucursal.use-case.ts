import { SucursalDomainError } from '../../domain/errors/sucursal.error';
import { SucursalRules, type Sucursal } from '../../domain/models/sucursal.model';
import type { SucursalRepository } from '../../domain/ports/sucursal.repository';
import type { CreateSucursalInput } from '../dtos/sucursal.dto';

export class CreateSucursalUseCase {
  private readonly repository: SucursalRepository;

  constructor(repository: SucursalRepository) {
    this.repository = repository;
  }

  async execute(input: CreateSucursalInput): Promise<Sucursal> {
    const nombre = SucursalRules.normalizeNombre(input.nombre);
    const direccion = SucursalRules.normalizeDireccion(input.direccion);

    if (!SucursalRules.isValidNombre(nombre)) {
      throw new SucursalDomainError('El nombre de la sucursal debe tener entre 2 y 100 caracteres.');
    }

    if (!SucursalRules.isValidDireccion(direccion)) {
      throw new SucursalDomainError('La dirección de la sucursal debe tener entre 3 y 255 caracteres.');
    }

    return this.repository.create({ nombre, direccion });
  }
}

