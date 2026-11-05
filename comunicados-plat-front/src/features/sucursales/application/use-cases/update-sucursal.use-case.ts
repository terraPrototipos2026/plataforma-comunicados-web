import { SucursalDomainError } from '../../domain/errors/sucursal.error';
import { SucursalRules, type Sucursal } from '../../domain/models/sucursal.model';
import type { SucursalRepository } from '../../domain/ports/sucursal.repository';
import type { UpdateSucursalInput } from '../dtos/sucursal.dto';

export class UpdateSucursalUseCase {
  private readonly repository: SucursalRepository;

  constructor(repository: SucursalRepository) {
    this.repository = repository;
  }

  async execute(input: UpdateSucursalInput): Promise<Sucursal> {
    if (!input.idSucursal.trim()) {
      throw new SucursalDomainError('El identificador de la sucursal es obligatorio.');
    }

    const payload: { idSucursal: string; nombre?: string; direccion?: string } = {
      idSucursal: input.idSucursal,
    };

    if (input.nombre !== undefined) {
      const nombre = SucursalRules.normalizeNombre(input.nombre);
      if (!SucursalRules.isValidNombre(nombre)) {
        throw new SucursalDomainError('El nombre de la sucursal debe tener entre 2 y 100 caracteres.');
      }
      payload.nombre = nombre;
    }

    if (input.direccion !== undefined) {
      const direccion = SucursalRules.normalizeDireccion(input.direccion);
      if (!SucursalRules.isValidDireccion(direccion)) {
        throw new SucursalDomainError('La dirección de la sucursal debe tener entre 3 y 255 caracteres.');
      }
      payload.direccion = direccion;
    }

    return this.repository.update(payload);
  }
}

