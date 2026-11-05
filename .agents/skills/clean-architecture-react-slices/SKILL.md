---
name: clean-architecture-react-slices
description: >-
  Guía, estructura y genera código en React aplicando Clean Architecture orientada a características (Vertical Slices / Feature-Driven) combinada con React Router, Zustand, TanStack Query y Axios. Úsala al crear nuevas features, modelos de dominio, casos de uso, adaptadores HTTP, mappers, hooks de servidor, stores de UI o rutas en el frontend.
---

# Clean Architecture Frontend (Vertical Slices) con React

Guía para estructurar, implementar y refactorizar aplicaciones frontend escalables en React organizadas por **funcionalidades de negocio (Vertical Slices / Feature-Driven)**, aplicando separación estricta de capas, Inversión de Dependencias (DIP) y gestión diferenciada entre Server State y Client/UI State.

---

## 1. Principios Arquitectónicos y Stack Tecnológico

1. **Regla de Dependencia:** Las dependencias de código fuente apuntan siempre hacia adentro (hacia el Dominio):
   $$\text{Presentation / Infrastructure} \longrightarrow \text{Application} \longrightarrow \text{Domain}$$
2. **Pureza del Dominio:** La capa `domain/` tiene **cero dependencias externas** (prohibido importar React, Axios, Zustand, TanStack Query o librerías de UI).
3. **Regla de Oro del Estado (Server vs. Client State):**
   - **Server State (`TanStack Query`):** Todo dato que provenga del backend le pertenece exclusivamente a TanStack Query (caché, revalidación, mutaciones, invalidación). **Nunca dupliques respuestas de la API dentro de Zustand.**
   - **Client / UI State (`Zustand`):** Reservado exclusivamente para estado efímero de la interfaz (modales abiertos, filtros seleccionados, paso activo de un wizard, preferencias visuales) o sesión/credenciales en `core/store`.
4. **Aislamiento Anticorrupción (Mappers):** Los componentes y casos de uso nunca consumen directamente el contrato crudo del backend (`snake_case` o estructuras anidadas de transporte). Todo pasa por un `Mapper` en `infrastructure/mappers/`.

| Tecnología | Capa / Ubicación | Propósito Principal |
|---|---|---|
| **Axios** | `core/http` & `infrastructure/adapters` | Cliente HTTP base, interceptores de autenticación/errores y adaptadores concretos de API. |
| **TanStack Query** | `presentation/hooks` | Gestión del **Server State** (queries, mutaciones, invalidación de caché, optimistic updates). |
| **Zustand** | `presentation/store` & `core/store` | Gestión exclusiva del **Client/UI State** (estado interactivo local a la feature o sesión global). |
| **React Router** | `core/router` & `presentation/routes` | Enrutamiento declarativo por feature, code-splitting (`lazy`) y guardas de acceso (`ProtectedRoute`). |

---

## 2. Estructura Estándar de Directorios

```text
src/
├── core/                                  # Fundaciones técnicas transversales
│   ├── http/                              # Cliente Axios base, interceptores y normalización de errores
│   │   ├── api-client.ts
│   │   └── http-error.ts
│   ├── store/                             # Stores globales de Zustand (auth, sesión, tema)
│   │   └── use-auth-store.ts
│   ├── router/                            # Orquestador de rutas y guardas de navegación
│   │   ├── app-router.tsx
│   │   └── protected-route.tsx
│   └── types/                             # Contratos transversales (PaginatedResult, ApiError, etc.)
│       └── pagination.types.ts
│
├── features/                              # VERTICAL SLICES (Una carpeta autocontenida por módulo de negocio)
│   └── [feature-name]/
│       ├── domain/                        # NÚCLEO: Entidades, reglas puras y contratos (CERO librerías externas)
│       │   ├── models/
│       │   │   └── [entity].model.ts
│       │   ├── errors/
│       │   │   └── [feature].error.ts
│       │   └── ports/                     # Interfaces (Puertos) que definen operaciones requeridas
│       │       └── [feature].repository.ts
│       │
│       ├── application/                   # ORQUESTACIÓN: Casos de uso y reglas de flujo de aplicación
│       │   ├── use-cases/
│       │   │   ├── [action].use-case.ts
│       │   │   └── [action].use-case.test.ts
│       │   └── dtos/                      # Contratos de entrada/salida de los casos de uso
│       │       └── [action].dto.ts
│       │
│       ├── infrastructure/                # ADAPTADORES: Implementaciones Axios, DTOs de API y Mappers
│       │   ├── dtos/                      # Contratos exactos de transporte HTTP (respuestas/requests del backend)
│       │   │   └── [entity]-api.dto.ts
│       │   ├── mappers/                   # Transformación bidireccional: DTO API <--> Modelo de Dominio
│       │   │   └── [feature].mapper.ts
│       │   ├── adapters/                  # Implementación concreta del puerto del dominio con Axios
│       │   │   └── [feature]-axios.repository.ts
│       │   └── container.ts               # Instanciación / inyección de dependencias de la feature
│       │
│       └── presentation/                  # UI Y CONECTORES DE ESTADO: React, TanStack Query y Zustand
│           ├── hooks/                     # Custom hooks para Server State (useQuery / useMutation)
│           │   ├── use-[query-name].ts
│           │   └── use-[mutation-name].ts
│           ├── store/                     # Estado UI local de la feature (filtros, modales, selección)
│           │   └── use-[feature]-ui-store.ts
│           ├── components/                # Componentes visuales cohesivos de la feature
│           ├── pages/                     # Vistas/Páginas completas conectadas a hooks
│           └── routes/                    # Definición de subrutas con carga perezosa (lazy)
│               └── [feature].routes.tsx
│
├── shared/                                # UI Kit genérico y utilidades desacopladas del negocio
│   ├── components/                        # Button, Input, Modal, DataTable, AppLayout
│   └── utils/
└── main.tsx
```

---

## 3. Estándares de Implementación por Capa

### A. Fundaciones Transversales (`core/`)

Configura una única instancia de Axios con interceptores para inyectar credenciales y transformar errores HTTP en errores tipados (`HttpError`).

```typescript
// src/core/http/http-error.ts
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
```

```typescript
// src/core/http/api-client.ts
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/use-auth-store';
import { HttpError } from './http-error';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    const status = error.response?.status ?? 500;
    const message = error.response?.data?.message ?? error.message ?? 'Error inesperado de red';
    const code = error.response?.data?.code;

    if (status === 401) {
      useAuthStore.getState().clearSession();
    }

    return Promise.reject(new HttpError(status, message, code, error.response?.data));
  },
);
```

---

### B. Capa de Dominio (`features/[feature]/domain/`)

#### Reglas:
- Define entidades/modelos en camelCase y reglas de negocio invariantes puras.
- Define **Puertos** (`interfaces`) para declarar qué operaciones externas necesita la feature.
- **Prohibido** importar librerías de infraestructura o UI.

#### Patrón:
```typescript
// src/features/comunicados/domain/models/comunicado.model.ts
export type ComunicadoPrioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface Comunicado {
  id: string;
  titulo: string;
  contenido: string;
  prioridad: ComunicadoPrioridad;
  departamentoId: string;
  publicadoPorId: string;
  fechaPublicacion: Date;
  leido: boolean;
}

export const ComunicadoRules = {
  esUrgenteSinLeer(comunicado: Comunicado): boolean {
    return comunicado.prioridad === 'URGENTE' && !comunicado.leido;
  },
  validarTitulo(titulo: string): boolean {
    return titulo.trim().length >= 5 && titulo.trim().length <= 150;
  },
};
```

```typescript
// src/features/comunicados/domain/ports/comunicado.repository.ts
import { Comunicado, ComunicadoPrioridad } from '../models/comunicado.model';

export interface ComunicadoFilterParams {
  departamentoId?: string;
  prioridad?: ComunicadoPrioridad;
  soloNoLeidos?: boolean;
  search?: string;
}

export interface CreateComunicadoParams {
  titulo: string;
  contenido: string;
  prioridad: ComunicadoPrioridad;
  departamentoId: string;
}

export interface ComunicadoRepository {
  findAll(filters?: ComunicadoFilterParams): Promise<Comunicado[]>;
  findById(id: string): Promise<Comunicado>;
  create(data: CreateComunicadoParams): Promise<Comunicado>;
  markAsRead(id: string): Promise<void>;
}
```

---

### C. Capa de Aplicación (`features/[feature]/application/`)

#### Reglas:
- Orquesta los flujos de negocio mediante **Casos de Uso** (`UseCase`).
- Depende **únicamente** de `domain/` (recibe el puerto `Repository` por inyección en el constructor).
- Valida precondiciones de negocio antes de invocar al repositorio.

#### Patrón:
```typescript
// src/features/comunicados/application/dtos/create-comunicado.dto.ts
import { ComunicadoPrioridad } from '../../domain/models/comunicado.model';

export interface CreateComunicadoInput {
  titulo: string;
  contenido: string;
  prioridad: ComunicadoPrioridad;
  departamentoId: string;
}
```

```typescript
// src/features/comunicados/application/use-cases/create-comunicado.use-case.ts
import { Comunicado, ComunicadoRules } from '../../domain/models/comunicado.model';
import { ComunicadoRepository } from '../../domain/ports/comunicado.repository';
import { CreateComunicadoInput } from '../dtos/create-comunicado.dto';

export class CreateComunicadoUseCase {
  constructor(private readonly repository: ComunicadoRepository) {}

  async execute(input: CreateComunicadoInput): Promise<Comunicado> {
    if (!ComunicadoRules.validarTitulo(input.titulo)) {
      throw new Error('El título del comunicado debe tener entre 5 y 150 caracteres.');
    }

    if (!input.contenido.trim()) {
      throw new Error('El contenido del comunicado no puede estar vacío.');
    }

    return this.repository.create({
      titulo: input.titulo.trim(),
      contenido: input.contenido.trim(),
      prioridad: input.prioridad,
      departamentoId: input.departamentoId,
    });
  }
}
```

---

### D. Capa de Infraestructura (`features/[feature]/infrastructure/`)

#### Reglas:
- Define los DTOs crudos de la API (`[entity]-api.dto.ts`) tal como los envía o espera el backend.
- Implementa `Mapper` estáticos o funciones puras (`toDomain`, `toApiRequest`) para aislar cambios del backend.
- Implementa el contrato del repositorio usando `apiClient` (Axios).
- Expone un contenedor ligero (`container.ts`) que ensambla el repositorio y los casos de uso para la capa de presentación.

#### Patrón:
```typescript
// src/features/comunicados/infrastructure/dtos/comunicado-api.dto.ts
export interface ComunicadoApiResponseDto {
  id: string;
  titulo: string;
  contenido: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  departamento_id: string;
  publicado_por_id: string;
  fecha_publicacion: string; // ISO string desde el backend
  leido: boolean;
}

export interface CreateComunicadoApiRequestDto {
  titulo: string;
  contenido: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  departamento_id: string;
}
```

```typescript
// src/features/comunicados/infrastructure/mappers/comunicado.mapper.ts
import { Comunicado } from '../../domain/models/comunicado.model';
import { CreateComunicadoParams } from '../../domain/ports/comunicado.repository';
import {
  ComunicadoApiResponseDto,
  CreateComunicadoApiRequestDto,
} from '../dtos/comunicado-api.dto';

export class ComunicadoMapper {
  static toDomain(dto: ComunicadoApiResponseDto): Comunicado {
    return {
      id: dto.id,
      titulo: dto.titulo,
      contenido: dto.contenido,
      prioridad: dto.prioridad,
      departamentoId: dto.departamento_id,
      publicadoPorId: dto.publicado_por_id,
      fechaPublicacion: new Date(dto.fecha_publicacion),
      leido: Boolean(dto.leido),
    };
  }

  static toCreateRequest(params: CreateComunicadoParams): CreateComunicadoApiRequestDto {
    return {
      titulo: params.titulo,
      contenido: params.contenido,
      prioridad: params.prioridad,
      departamento_id: params.departamentoId,
    };
  }
}
```

```typescript
// src/features/comunicados/infrastructure/adapters/comunicado-axios.repository.ts
import { apiClient } from '@/core/http/api-client';
import { Comunicado } from '../../domain/models/comunicado.model';
import {
  ComunicadoFilterParams,
  ComunicadoRepository,
  CreateComunicadoParams,
} from '../../domain/ports/comunicado.repository';
import { ComunicadoApiResponseDto } from '../dtos/comunicado-api.dto';
import { ComunicadoMapper } from '../mappers/comunicado.mapper';

export class ComunicadoAxiosRepository implements ComunicadoRepository {
  private readonly basePath = '/comunicados';

  async findAll(filters?: ComunicadoFilterParams): Promise<Comunicado[]> {
    const { data } = await apiClient.get<ComunicadoApiResponseDto[]>(this.basePath, {
      params: {
        departamento_id: filters?.departamentoId,
        prioridad: filters?.prioridad,
        solo_no_leidos: filters?.soloNoLeidos,
        search: filters?.search,
      },
    });
    return data.map(ComunicadoMapper.toDomain);
  }

  async findById(id: string): Promise<Comunicado> {
    const { data } = await apiClient.get<ComunicadoApiResponseDto>(`${this.basePath}/${id}`);
    return ComunicadoMapper.toDomain(data);
  }

  async create(params: CreateComunicadoParams): Promise<Comunicado> {
    const payload = ComunicadoMapper.toCreateRequest(params);
    const { data } = await apiClient.post<ComunicadoApiResponseDto>(this.basePath, payload);
    return ComunicadoMapper.toDomain(data);
  }

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`${this.basePath}/${id}/read`);
  }
}
```

```typescript
// src/features/comunicados/infrastructure/container.ts
import { CreateComunicadoUseCase } from '../application/use-cases/create-comunicado.use-case';
import { ComunicadoAxiosRepository } from './adapters/comunicado-axios.repository';

const comunicadoRepository = new ComunicadoAxiosRepository();

export const comunicadosContainer = {
  repository: comunicadoRepository,
  createComunicadoUseCase: new CreateComunicadoUseCase(comunicadoRepository),
};
```

---

### E. Capa de Presentación (`features/[feature]/presentation/`)

#### Reglas:
1. **Query Key Factory:** Centraliza las claves de caché de TanStack Query por feature.
2. **Hooks de Server State (`hooks/`):** Envuelven `useQuery` y `useMutation` invocando los casos de uso o repositorios del `container`. Nunca expongas llamadas Axios directas en un componente.
3. **Stores de UI (`store/`):** En Zustand solo vive el estado interactivo de la vista (filtros activos, ID del elemento seleccionado en un modal, etc.).
4. **Componentes y Páginas (`components/`, `pages/`):** Componentes declarativos que leen estado desde los hooks de TanStack Query y los stores de Zustand.

#### Patrón:
```typescript
// src/features/comunicados/presentation/store/use-comunicados-ui-store.ts
import { create } from 'zustand';
import { ComunicadoFilterParams } from '../../domain/ports/comunicado.repository';

interface ComunicadosUiState {
  filters: ComunicadoFilterParams;
  isCreateModalOpen: boolean;
  selectedComunicadoId: string | null;
  setFilters: (filters: Partial<ComunicadoFilterParams>) => void;
  resetFilters: () => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  selectComunicado: (id: string | null) => void;
}

const initialFilters: ComunicadoFilterParams = {
  soloNoLeidos: false,
  search: '',
};

export const useComunicadosUiStore = create<ComunicadosUiState>((set) => ({
  filters: initialFilters,
  isCreateModalOpen: false,
  selectedComunicadoId: null,
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: initialFilters }),
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  selectComunicado: (id) => set({ selectedComunicadoId: id }),
}));
```

```typescript
// src/features/comunicados/presentation/hooks/use-comunicados-query.ts
import { useQuery } from '@tanstack/react-query';
import { ComunicadoFilterParams } from '../../domain/ports/comunicado.repository';
import { comunicadosContainer } from '../../infrastructure/container';

export const comunicadosKeys = {
  all: ['comunicados'] as const,
  lists: () => [...comunicadosKeys.all, 'list'] as const,
  list: (filters?: ComunicadoFilterParams) => [...comunicadosKeys.lists(), filters] as const,
  details: () => [...comunicadosKeys.all, 'detail'] as const,
  detail: (id: string) => [...comunicadosKeys.details(), id] as const,
};

export function useComunicadosQuery(filters?: ComunicadoFilterParams) {
  return useQuery({
    queryKey: comunicadosKeys.list(filters),
    queryFn: () => comunicadosContainer.repository.findAll(filters),
  });
}
```

```typescript
// src/features/comunicados/presentation/hooks/use-create-comunicado-mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateComunicadoInput } from '../../application/dtos/create-comunicado.dto';
import { comunicadosContainer } from '../../infrastructure/container';
import { comunicadosKeys } from './use-comunicados-query';

export function useCreateComunicadoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateComunicadoInput) =>
      comunicadosContainer.createComunicadoUseCase.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: comunicadosKeys.lists() });
    },
  });
}
```

```tsx
// src/features/comunicados/presentation/routes/comunicados.routes.tsx
import { lazy } from 'react';
import { RouteObject } from 'react-router';

const ComunicadosListPage = lazy(() => import('../pages/comunicados-list.page'));

export const comunicadosRoutes: RouteObject[] = [
  {
    path: 'comunicados',
    children: [
      {
        index: true,
        element: <ComunicadosListPage />,
      },
    ],
  },
];
```

---

## 4. Flujo de Trabajo para Crear una Nueva Feature

Cuando el usuario solicite crear o migrar un módulo funcional (ej. `auth`, `comunicados`, `departamentos`, `usuarios`), sigue estrictamente este orden **de adentro hacia afuera**:

1. **Dominio (`domain/`):**
   - Crea el modelo limpio en `domain/models/[entity].model.ts`.
   - Define el contrato en `domain/ports/[feature].repository.ts`.
2. **Aplicación (`application/`):**
   - Crea los DTOs de entrada/salida en `application/dtos/`.
   - Implementa los casos de uso en `application/use-cases/[action].use-case.ts` recibiendo el puerto por constructor.
3. **Infraestructura (`infrastructure/`):**
   - Declara las interfaces exactas del backend en `infrastructure/dtos/[entity]-api.dto.ts`.
   - Crea el `Mapper` en `infrastructure/mappers/[feature].mapper.ts`.
   - Implementa el repositorio con `apiClient` en `infrastructure/adapters/[feature]-axios.repository.ts`.
   - Registra las instancias en `infrastructure/container.ts`.
4. **Presentación (`presentation/`):**
   - Crea los hooks de `useQuery` / `useMutation` en `presentation/hooks/`.
   - Si hay estado visual compartido en la vista, crea el store de Zustand en `presentation/store/`.
   - Construye los componentes (`presentation/components/`) y páginas (`presentation/pages/`).
   - Registra las rutas de la feature en `presentation/routes/[feature].routes.tsx` y conéctalas en `src/core/router/app-router.tsx`.

---

## 5. Checklist de Calidad Arquitectónica (Code Review)

Antes de dar por finalizada cualquier implementación, verifica que se cumplan todos los puntos:

- [ ] **Pureza del Dominio:** ¿Algún archivo dentro de `domain/` o `application/` importa `react`, `axios`, `zustand` o `@tanstack/react-query`? *(Debe ser **NO**)*.
- [ ] **Separación de Estados:** ¿Se están guardando listas o entidades provenientes de la API en un store de Zustand en lugar de usar `TanStack Query`? *(Debe ser **NO**)*.
- [ ] **Aislamiento de Transporte:** ¿Algún componente de React o Caso de Uso accede a propiedades `snake_case` del backend sin pasar antes por un `Mapper` de infraestructura? *(Debe ser **NO**)*.
- [ ] **Cero HTTP en Vistas:** ¿Algún componente `.tsx` o hook invoca `axios.get/post` o `fetch` directamente en lugar de usar el repositorio/caso de uso? *(Debe ser **NO**)*.
- [ ] **Encapsulamiento Vertical:** ¿Cada feature mantiene sus modelos, casos de uso, adaptadores y vistas dentro de `src/features/[feature-name]/` sin contaminar `shared/` con lógica de negocio específica? *(Debe ser **SÍ**)*.
- [ ] **Testabilidad Aislada:** ¿Los casos de uso en `application/use-cases/` pueden probarse unitariamente pasando un mock en memoria de `[Feature]Repository` sin levantar React ni interceptar red? *(Debe ser **SÍ**)*.

