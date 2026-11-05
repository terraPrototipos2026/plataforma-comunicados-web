import { describe, it, expect, beforeEach } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Departamento } from '../../domain/entities/departamento.entity.js';
import type { DepartamentoRepositoryPort } from '../../domain/ports/departamento.repository.port.js';
import { CreateDepartamentoUseCase } from './create-departamento.use-case.js';
import { GetDepartamentosUseCase } from './get-departamentos.use-case.js';
import { UpdateDepartamentoUseCase } from './update-departamento.use-case.js';
import { DeleteDepartamentoUseCase } from './delete-departamento.use-case.js';

class InMemoryDepartamentoRepository implements DepartamentoRepositoryPort {
  public items = new Map<string, Departamento>();
  public assignedUsersByDepto = new Set<string>();

  async findAll(): Promise<Departamento[]> {
    return Array.from(this.items.values());
  }

  async findById(idDepartamento: string): Promise<Departamento | null> {
    return this.items.get(idDepartamento) ?? null;
  }

  async findByNombre(nombre: string): Promise<Departamento | null> {
    const normalized = nombre.trim().toLowerCase();
    for (const item of this.items.values()) {
      if (item.nombre === normalized) return item;
    }
    return null;
  }

  async save(departamento: Departamento): Promise<void> {
    this.items.set(departamento.idDepartamento, departamento);
  }

  async delete(idDepartamento: string): Promise<void> {
    this.items.delete(idDepartamento);
  }

  async hasAssignedUsers(idDepartamento: string): Promise<boolean> {
    return this.assignedUsersByDepto.has(idDepartamento);
  }
}

describe('Departamentos Use Cases (Clean Architecture Unit Tests)', () => {
  let repo: InMemoryDepartamentoRepository;
  let createUseCase: CreateDepartamentoUseCase;
  let getUseCase: GetDepartamentosUseCase;
  let updateUseCase: UpdateDepartamentoUseCase;
  let deleteUseCase: DeleteDepartamentoUseCase;

  beforeEach(() => {
    repo = new InMemoryDepartamentoRepository();
    createUseCase = new CreateDepartamentoUseCase(repo);
    getUseCase = new GetDepartamentosUseCase(repo);
    updateUseCase = new UpdateDepartamentoUseCase(repo);
    deleteUseCase = new DeleteDepartamentoUseCase(repo);
  });

  it('debe crear un departamento normalizando su nombre a minúsculas', async () => {
    const created = await createUseCase.execute({ nombre: '  Logística  ' });
    expect(created.nombre).toBe('logística');
    expect(created.idDepartamento).toBeDefined();

    const list = await getUseCase.findAll();
    expect(list).toHaveLength(1);
  });

  it('debe rechazar con ConflictException si el departamento ya existe', async () => {
    await createUseCase.execute({ nombre: 'sistemas' });
    await expect(createUseCase.execute({ nombre: 'SISTEMAS' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('debe actualizar el nombre de un departamento existente', async () => {
    const created = await createUseCase.execute({ nombre: 'ventas' });
    const updated = await updateUseCase.execute({
      idDepartamento: created.idDepartamento,
      nombre: 'Ventas Corporativas',
    });

    expect(updated.nombre).toBe('ventas corporativas');
  });

  it('debe impedir eliminar un departamento con usuarios asignados', async () => {
    const created = await createUseCase.execute({ nombre: 'marketing' });
    repo.assignedUsersByDepto.add(created.idDepartamento);

    await expect(deleteUseCase.execute(created.idDepartamento)).rejects.toThrow(
      ConflictException,
    );
  });

  it('debe eliminar un departamento sin usuarios asignados y lanzar NotFoundException luego', async () => {
    const created = await createUseCase.execute({ nombre: 'temporal' });
    await deleteUseCase.execute(created.idDepartamento);

    await expect(getUseCase.findById(created.idDepartamento)).rejects.toThrow(
      NotFoundException,
    );
  });
});
