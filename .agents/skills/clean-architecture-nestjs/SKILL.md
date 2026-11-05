---
name: clean-architecture-nestjs
description: >-
  Guides the design, implementation, and refactoring of NestJS backend services following Clean Architecture principles (Robert C. Martin). Use when creating new modules, designing domain entities, value objects, use cases, ports, and adapters, structuring directory layouts, or reviewing NestJS code for clean architecture compliance.
---

# Clean Architecture in NestJS

## Purpose
Guide the development and refactoring of NestJS backend services following Robert C. Martin's Clean Architecture principles. Ensures strict boundary separation, dependency inversion, pure domain modeling, and testability within NestJS's dependency injection ecosystem.

---

## Architectural Principles

1. **Dependency Rule:** Source code dependencies point inward toward the core:
   $$\text{Infrastructure / Presentation} \longrightarrow \text{Application} \longrightarrow \text{Domain}$$
2. **Domain Purity:** The Domain layer contains zero dependencies on NestJS decorators (`@Injectable()`, `@Inject()`), ORM decorators (`@Entity()`, `@Column()`), or protocol specifics.
3. **Explicit Boundary Crossing:** Data crosses architectural boundaries exclusively via DTOs (Data Transfer Objects), primitives, or pure domain entities mapped through dedicated mappers.
4. **Port & Adapter (DIP):** The domain/application defines ports (interfaces and injection tokens); infrastructure provides the adapters and registers them via NestJS custom providers.

---

## Standard Module Directory Layout

Organize features via vertical slices while maintaining internal layer separation:

```text
src/
└── modules/
    └── <feature>/
        ├── domain/                     # Core Business Rules (Zero framework deps)
        │   ├── entities/               # Entity.ts (entity/aggregate root)
        │   ├── value-objects/          # Value objects (e.g. Email.ts)
        │   ├── exceptions/             # Domain exceptions
        │   └── ports/                  # Interfaces for outbound communication
        │       └── <feature>.repository.port.ts
        │
        ├── application/                # Application Business Rules
        │   ├── use-cases/              # Command/Query use cases
        │   ├── dtos/                   # Input/Output DTOs
        │   └── ports/                  # Application-level service interfaces (e.g. mailer, hasher)
        │       └── service.port.ts
        │
        ├── infrastructure/             # Frameworks, Drivers & Adapters
        │   ├── persistence/            # DB models, migrations, repositories
        │   │   ├── prisma/ (or orm)
        │   │   │   ├── <feature>.mapper.ts  # Maps Persistence Model <-> Domain Entity
        │   │   │   └── <feature>-prisma.repository.ts
        │   ├── adapters/               # Concrete adapters for app ports
        │   │   └── concrete-service.adapter.ts
        │   └── tokens.ts               # DI Injection tokens (Symbols/Strings)
        │
        ├── presentation/               # Interface Adapters (Inbound)
        │   ├── controllers/            # <feature>.controller.ts
        │   └── dtos/                   # HTTP Request/Response schemas + validation
        │       ├── create-<feature>.request.dto.ts
        │       └── <feature>.response.dto.ts
        │
        └── <feature>.module.ts         # NestJS wire-up module
```

---

## Layer Implementation Standards

### 1. Domain Layer (`domain/`)

#### Rules:
- Plain TypeScript classes or factories only.
- Encapsulate invariants and business behavior inside the entity.
- Do not import `@nestjs/common`, TypeORM, Prisma, or external network clients.

#### Pattern:
```typescript
// domain/entities/user.entity.ts
import { Email } from '../value-objects/email.vo';

export interface UserProps {
  id: string;
  email: Email;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  public static create(props: Omit<UserProps, 'isActive' | 'createdAt'>): User {
    return new User({
      ...props,
      isActive: true,
      createdAt: new Date(),
    });
  }

  public static reconstitute(props: UserProps): User {
    return new User(props);
  }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public get id(): string { return this.props.id; }
  public get email(): Email { return this.props.email; }
  public get passwordHash(): string { return this.props.passwordHash; }
  public get isActive(): boolean { return this.props.isActive; }
  public get createdAt(): Date { return this.props.createdAt; }
}
```

```typescript
// domain/ports/user.repository.port.ts
import { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

---

### 2. Application Layer (`application/`)

#### Rules:
- One single responsibility per Use Case file (Command/Query pattern).
- Inject dependencies using injection tokens defined in the infrastructure or port level.
- Return flat outputs (`DTO`) or domain entities, never database models.

#### Pattern:
```typescript
// application/use-cases/register-user.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { PasswordHasherPort } from '../ports/password-hasher.port';
import { USER_REPOSITORY_TOKEN, PASSWORD_HASHER_TOKEN } from '../../infrastructure/tokens';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';

export interface RegisterUserInput {
  id: string;
  email: string;
  plainPassword: string;
}

export interface RegisterUserOutput {
  id: string;
  email: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const emailVO = Email.create(input.email);
    const existing = await this.userRepository.findByEmail(emailVO.value);

    if (existing) {
      throw new UserAlreadyExistsException(`Email ${input.email} is already in use.`);
    }

    const passwordHash = await this.passwordHasher.hash(input.plainPassword);

    const user = User.create({
      id: input.id,
      email: emailVO,
      passwordHash,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email.value,
    };
  }
}
```

---

### 3. Infrastructure Layer (`infrastructure/`)

#### Rules:
- Implement the ports defined in `domain/ports` or `application/ports`.
- Mappers are mandatory: Never pass DB models upward to application or domain layers.
- Expose DI Tokens for NestJS bindings.

#### Pattern:
```typescript
// infrastructure/tokens.ts
export const USER_REPOSITORY_TOKEN = Symbol('USER_REPOSITORY_TOKEN');
export const PASSWORD_HASHER_TOKEN = Symbol('PASSWORD_HASHER_TOKEN');
```

```typescript
// infrastructure/persistence/prisma/user.mapper.ts
import { User as PrismaUserModel } from '@prisma/client';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';

export class UserMapper {
  public static toDomain(raw: PrismaUserModel): User {
    return User.reconstitute({
      id: raw.id,
      email: Email.create(raw.email),
      passwordHash: raw.passwordHash,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
    });
  }

  public static toPersistence(user: User): PrismaUserModel {
    return {
      id: user.id,
      email: user.email.value,
      passwordHash: user.passwordHash,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
```

```typescript
// infrastructure/persistence/prisma/user-prisma.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma.service';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserPrismaRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.prisma.user.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}
```

---

### 4. Presentation Layer (`presentation/`)

#### Rules:
- Controllers must stay "skinny": parse request, run DTO validation (`class-validator`), delegate to Use Case, return formatted HTTP response.
- Business decisions or data transformations belong in the Use Case and Mapper, not in controllers.

#### Pattern:
```typescript
// presentation/controllers/users.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { CreateUserRequestDto } from '../dtos/create-user.request.dto';
import { UserResponseDto } from '../dtos/user.response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    const result = await this.registerUserUseCase.execute({
      id: randomUUID(),
      email: dto.email,
      plainPassword: dto.password,
    });

    return new UserResponseDto(result.id, result.email);
  }
}
```

---

### 5. Dependency Injection Wiring (`users.module.ts`)

Wire concrete implementations to abstract tokens using NestJS providers:

```typescript
// users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './presentation/controllers/users.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { USER_REPOSITORY_TOKEN, PASSWORD_HASHER_TOKEN } from './infrastructure/tokens';
import { UserPrismaRepository } from './infrastructure/persistence/prisma/user-prisma.repository';
import { BcryptPasswordHasherAdapter } from './infrastructure/adapters/bcrypt-password-hasher.adapter';
import { PrismaModule } from '../../shared/infrastructure/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    RegisterUserUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserPrismaRepository,
    },
    {
      provide: PASSWORD_HASHER_TOKEN,
      useClass: BcryptPasswordHasherAdapter,
    },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UsersModule {}
```

---

## Quality Checklist for Code Reviews

- [ ] **No framework leaks in Domain:** Does any file in `domain/` import `@nestjs`, an ORM, or HTTP decorators? *(Must be NO)*.
- [ ] **Interfaces point inward:** Does the application layer depend on concrete infrastructure classes directly? *(Must be NO; use tokens and port interfaces)*.
- [ ] **Boundary translation:** Are ORM models passed to Use Cases or Controllers? *(Must be NO; use explicit mappers)*.
- [ ] **Isolated Unit Tests:** Can Use Cases and Domain Entities be tested using in-memory mocks without initializing `Test.createTestingModule` or launching a DB container? *(Must be YES)*.

