import { describe, it, expect, beforeEach } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Permiso } from '../../domain/entities/permiso.entity.js';
import type { PermisoRepositoryPort } from '../../domain/ports/permiso.repository.port.js';
import { CreatePermisoUseCase } from './create-permiso.use-case.js';
import { GetPermisosUseCase } from './get-permisos.use-case.js';
import { UpdatePermisoUseCase } from './update-permiso.use-case.js';
import { DeletePermisoUseCase } from './delete-permiso.use-case.js';

class InMemoryPermisoRepository implements PermisoRepositoryPort {
  public items = new Map<string, Permiso>();

  async findAll(): Promise<Permiso[]> {
    return Array.from(this.items.values());
  }

  async findById(idPermiso: string): Promise<Permiso | null> {
    return this.items.get(idPermiso) ?? null;
  }

  async findByIds(idPermisos: string[]): Promise<Permiso[]> {
    return idPermisos
      .map((id) => this.items.get(id))
      .filter((p): p is Permiso => p !== undefined);
  }

  async findByNombre(nombre: string): Promise<Permiso | null> {
    const normalized = nombre.trim().toLowerCase();
    for (const item of this.items.values()) {
      if (item.nombre === normalized) return item;
    }
    return null;
  }

  async save(permiso: Permiso): Promise<void> {
    this.items.set(permiso.idPermiso, permiso);
  }

  async delete(idPermiso: string): Promise<void> {
    this.items.delete(idPermiso);
  }
}

describe('Permisos Use Cases (Clean Architecture Unit Tests)', () => {
  let repo: InMemoryPermisoRepository;
  let createUseCase: CreatePermisoUseCase;
  let getUseCase: GetPermisosUseCase;
  let updateUseCase: UpdatePermisoUseCase;
  let deleteUseCase: DeletePermisoUseCase;

  beforeEach(() => {
    repo = new InMemoryPermisoRepository();
    createUseCase = new CreatePermisoUseCase(repo);
    getUseCase = new GetPermisosUseCase(repo);
    updateUseCase = new UpdatePermisoUseCase(repo);
    deleteUseCase = new DeletePermisoUseCase(repo);
  });

  it('debe crear un permiso normalizando su nombre', async () => {
    const created = await createUseCase.execute({ nombre: '  COMUNICADOS:CREAR  ' });
    expect(created.nombre).toBe('comunicados:crear');
    expect(created.idPermiso).toBeDefined();
  });

  it('debe lanzar ConflictException cuando se intenta duplicar un permiso', async () => {
    await createUseCase.execute({ nombre: 'comunicados:leer' });
    await expect(createUseCase.execute({ nombre: 'COMUNICADOS:LEER' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('debe actualizar el código de un permiso', async () => {
    const created = await createUseCase.execute({ nombre: 'usuarios:ver' });
    const updated = await updateUseCase.execute({
      idPermiso: created.idPermiso,
      nombre: 'usuarios:listar',
    });

    expect(updated.nombre).toBe('usuarios:listar');
  });

  it('debe eliminar un permiso existente', async () => {
    const created = await createUseCase.execute({ nombre: 'comunicados:eliminar' });
    await deleteUseCase.execute(created.idPermiso);

    await expect(getUseCase.findById(created.idPermiso)).rejects.toThrow(NotFoundException);
  });
});
