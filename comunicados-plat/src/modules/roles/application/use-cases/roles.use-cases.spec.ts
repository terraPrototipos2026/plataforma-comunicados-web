import { describe, it, expect, beforeEach } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Rol } from '../../domain/entities/rol.entity.js';
import type { RolRepositoryPort } from '../../domain/ports/rol.repository.port.js';
import { Permiso } from '../../../permisos/domain/entities/permiso.entity.js';
import type { PermisoRepositoryPort } from '../../../permisos/domain/ports/permiso.repository.port.js';
import { CreateRolUseCase } from './create-rol.use-case.js';
import { GetRolesUseCase } from './get-roles.use-case.js';
import { UpdateRolUseCase } from './update-rol.use-case.js';
import { AssignPermisosToRolUseCase } from './assign-permisos-to-rol.use-case.js';
import { DeleteRolUseCase } from './delete-rol.use-case.js';

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

class InMemoryRolRepository implements RolRepositoryPort {
  public items = new Map<string, Rol>();
  public assignedUsersByRol = new Set<string>();

  constructor(private readonly permisoRepo: InMemoryPermisoRepository) {}

  async findAll(): Promise<Rol[]> {
    return Array.from(this.items.values());
  }

  async findById(idRol: string): Promise<Rol | null> {
    return this.items.get(idRol) ?? null;
  }

  async findByNombre(nombre: string): Promise<Rol | null> {
    const normalized = nombre.trim().toLowerCase();
    for (const item of this.items.values()) {
      if (item.nombre === normalized) return item;
    }
    return null;
  }

  async save(rol: Rol): Promise<void> {
    this.items.set(rol.idRol, rol);
  }

  async syncPermisos(idRol: string, permisoIds: string[]): Promise<Rol> {
    const rol = this.items.get(idRol);
    if (!rol) throw new Error('Rol no encontrado');

    const permisos = await this.permisoRepo.findByIds(permisoIds);
    rol.setPermisos(
      permisos.map((p) => ({
        idPermiso: p.idPermiso,
        nombre: p.nombre,
      })),
    );
    this.items.set(idRol, rol);
    return rol;
  }

  async delete(idRol: string): Promise<void> {
    this.items.delete(idRol);
  }

  async hasAssignedUsers(idRol: string): Promise<boolean> {
    return this.assignedUsersByRol.has(idRol);
  }
}

describe('Roles Use Cases (Clean Architecture Unit Tests)', () => {
  let permisoRepo: InMemoryPermisoRepository;
  let rolRepo: InMemoryRolRepository;
  let createRolUseCase: CreateRolUseCase;
  let getRolesUseCase: GetRolesUseCase;
  let updateRolUseCase: UpdateRolUseCase;
  let assignPermisosUseCase: AssignPermisosToRolUseCase;
  let deleteRolUseCase: DeleteRolUseCase;

  beforeEach(() => {
    permisoRepo = new InMemoryPermisoRepository();
    rolRepo = new InMemoryRolRepository(permisoRepo);
    createRolUseCase = new CreateRolUseCase(rolRepo, permisoRepo);
    getRolesUseCase = new GetRolesUseCase(rolRepo);
    updateRolUseCase = new UpdateRolUseCase(rolRepo);
    assignPermisosUseCase = new AssignPermisosToRolUseCase(rolRepo, permisoRepo);
    deleteRolUseCase = new DeleteRolUseCase(rolRepo);
  });

  it('debe crear un rol con permisos iniciales válidos', async () => {
    const p1 = Permiso.create({
      idPermiso: '11111111-1111-4111-8111-111111111111',
      nombre: 'comunicados:crear',
    });
    await permisoRepo.save(p1);

    const created = await createRolUseCase.execute({
      nombre: 'Editor Corporativo',
      permisoIds: [p1.idPermiso],
    });

    expect(created.nombre).toBe('editor corporativo');
    expect(created.permisos).toHaveLength(1);
    expect(created.permisos[0].nombre).toBe('comunicados:crear');
  });

  it('debe lanzar NotFoundException si se intenta asignar un permiso inexistente', async () => {
    const rol = await createRolUseCase.execute({ nombre: 'supervisor' });

    await expect(
      assignPermisosUseCase.execute({
        idRol: rol.idRol,
        permisoIds: ['99999999-9999-4999-8999-999999999999'],
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('debe sincronizar permisos de un rol existente', async () => {
    const p1 = Permiso.create({
      idPermiso: '11111111-1111-4111-8111-111111111111',
      nombre: 'comunicados:ver',
    });
    const p2 = Permiso.create({
      idPermiso: '22222222-2222-4222-8222-222222222222',
      nombre: 'comunicados:aprobar',
    });
    await permisoRepo.save(p1);
    await permisoRepo.save(p2);

    const rol = await createRolUseCase.execute({ nombre: 'jefe de área' });
    const synced = await assignPermisosUseCase.execute({
      idRol: rol.idRol,
      permisoIds: [p1.idPermiso, p2.idPermiso],
    });

    expect(synced.permisos).toHaveLength(2);
  });

  it('debe actualizar el nombre de un rol e impedir eliminar un rol con usuarios asignados', async () => {
    const rol = await createRolUseCase.execute({ nombre: 'analista' });
    const updated = await updateRolUseCase.execute({
      idRol: rol.idRol,
      nombre: 'Analista Senior',
    });
    expect(updated.nombre).toBe('analista senior');

    rolRepo.assignedUsersByRol.add(rol.idRol);
    await expect(deleteRolUseCase.execute(rol.idRol)).rejects.toThrow(ConflictException);

    rolRepo.assignedUsersByRol.delete(rol.idRol);
    await deleteRolUseCase.execute(rol.idRol);
    await expect(getRolesUseCase.findById(rol.idRol)).rejects.toThrow(NotFoundException);
  });
});
