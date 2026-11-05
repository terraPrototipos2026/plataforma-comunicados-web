import { describe, it, expect, beforeEach } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Sucursal } from '../../domain/entities/sucursal.entity.js';
import type { SucursalRepositoryPort } from '../../domain/ports/sucursal.repository.port.js';
import { CreateSucursalUseCase } from './create-sucursal.use-case.js';
import { GetSucursalesUseCase } from './get-sucursales.use-case.js';
import { UpdateSucursalUseCase } from './update-sucursal.use-case.js';
import { DeleteSucursalUseCase } from './delete-sucursal.use-case.js';

class InMemorySucursalRepository implements SucursalRepositoryPort {
  public items = new Map<string, Sucursal>();
  public assignedDeptoCount = new Set<string>();

  async findAll(): Promise<Sucursal[]> {
    return Array.from(this.items.values());
  }

  async findById(idSucursal: string): Promise<Sucursal | null> {
    return this.items.get(idSucursal) ?? null;
  }

  async findByNombre(nombre: string): Promise<Sucursal | null> {
    const normalized = nombre.trim().toLowerCase();
    for (const item of this.items.values()) {
      if (item.nombre === normalized) return item;
    }
    return null;
  }

  async save(sucursal: Sucursal): Promise<void> {
    this.items.set(sucursal.idSucursal, sucursal);
  }

  async delete(idSucursal: string): Promise<void> {
    this.items.delete(idSucursal);
  }

  async hasAssignedDepartamentos(idSucursal: string): Promise<boolean> {
    return this.assignedDeptoCount.has(idSucursal);
  }
}

describe('Sucursales Use Cases (Clean Architecture Unit Tests)', () => {
  let repo: InMemorySucursalRepository;
  let createUseCase: CreateSucursalUseCase;
  let getUseCase: GetSucursalesUseCase;
  let updateUseCase: UpdateSucursalUseCase;
  let deleteUseCase: DeleteSucursalUseCase;

  beforeEach(() => {
    repo = new InMemorySucursalRepository();
    createUseCase = new CreateSucursalUseCase(repo);
    getUseCase = new GetSucursalesUseCase(repo);
    updateUseCase = new UpdateSucursalUseCase(repo);
    deleteUseCase = new DeleteSucursalUseCase(repo);
  });

  it('debe crear una sucursal normalizando su nombre a minúsculas y limpiando la dirección', async () => {
    const created = await createUseCase.execute({
      nombre: '  Sucursal Central  ',
      direccion: '  Av. Principal 123  ',
    });

    expect(created.nombre).toBe('sucursal central');
    expect(created.direccion).toBe('Av. Principal 123');
    expect(created.idSucursal).toBeDefined();

    const all = await getUseCase.findAll();
    expect(all).toHaveLength(1);
  });

  it('debe rechazar con ConflictException si la sucursal ya existe', async () => {
    await createUseCase.execute({
      nombre: 'Sucursal Norte',
      direccion: 'Calle Norte 45',
    });

    await expect(
      createUseCase.execute({
        nombre: 'SUCURSAL NORTE',
        direccion: 'Otra dirección',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('debe actualizar los datos de una sucursal existente', async () => {
    const created = await createUseCase.execute({
      nombre: 'Sucursal Sur',
      direccion: 'Av. Sur 789',
    });

    const updated = await updateUseCase.execute({
      idSucursal: created.idSucursal,
      nombre: 'Sucursal Sur Renovada',
      direccion: 'Nueva Dirección 101',
    });

    expect(updated.nombre).toBe('sucursal sur renovada');
    expect(updated.direccion).toBe('Nueva Dirección 101');
  });

  it('debe impedir eliminar una sucursal con departamentos asociados', async () => {
    const created = await createUseCase.execute({
      nombre: 'Sucursal Este',
      direccion: 'Av. Este 500',
    });

    repo.assignedDeptoCount.add(created.idSucursal);

    await expect(deleteUseCase.execute(created.idSucursal)).rejects.toThrow(
      ConflictException,
    );
  });

  it('debe eliminar una sucursal sin departamentos y fallar con NotFoundException al consultarla después', async () => {
    const created = await createUseCase.execute({
      nombre: 'Sucursal Oeste',
      direccion: 'Av. Oeste 999',
    });

    const result = await deleteUseCase.execute(created.idSucursal);
    expect(result.message).toContain('eliminada exitosamente');

    await expect(getUseCase.findById(created.idSucursal)).rejects.toThrow(
      NotFoundException,
    );
  });
});
