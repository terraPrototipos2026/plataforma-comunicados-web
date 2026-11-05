import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  PASSWORD_HASHER_TOKEN,
  TOKEN_SERVICE_TOKEN,
  AUTH_USER_REPOSITORY_TOKEN,
  SESSION_REPOSITORY_TOKEN,
} from '../../infrastructure/tokens.js';
import type { PasswordHasherPort } from '../ports/password-hasher.port.js';
import type { TokenServicePort } from '../ports/token-service.port.js';
import type {
  AuthUserRepositoryPort,
  AuthUserDetails,
} from '../../domain/ports/auth-user.repository.port.js';
import type { SessionRepositoryPort } from '../../domain/ports/session.repository.port.js';
import { Session } from '../../domain/entities/session.entity.js';

export interface ClientContext {
  userAgent?: string | null;
  ipAddress?: string | null;
}

export interface RegisterInput {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
  rol: string;
  departamento: string;
}

export interface AuthSuccessResult {
  accessToken: string;
  refreshToken: string;
  user: {
    idUsuario: string;
    nombre: string;
    correo: string;
    rol: string;
    departamento: string;
    permisos: string[];
  };
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(PASSWORD_HASHER_TOKEN)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenServicePort,
    @Inject(AUTH_USER_REPOSITORY_TOKEN)
    private readonly userRepo: AuthUserRepositoryPort,
    @Inject(SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepo: SessionRepositoryPort,
  ) {}

  async register(input: RegisterInput): Promise<{ idUsuario: string; correo: string }> {
    const existing = await this.userRepo.findByEmail(input.correo);
    if (existing) {
      throw new ConflictException('El correo ya se encuentra registrado.');
    }

    const idRol = await this.userRepo.findRoleIdByName(input.rol);
    if (!idRol) {
      throw new NotFoundException(`El rol "${input.rol}" no existe.`);
    }

    const idDepartamento = await this.userRepo.findDepartmentIdByName(input.departamento);
    if (!idDepartamento) {
      throw new NotFoundException(`El departamento "${input.departamento}" no existe.`);
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);
    const idUsuario = await this.userRepo.create({
      nombre: input.nombre,
      correo: input.correo,
      password: hashedPassword,
      telefono: input.telefono,
      idRol,
      idDepartamento,
    });

    return { idUsuario, correo: input.correo };
  }

  async login(correo: string, passwordPlain: string, context: ClientContext): Promise<AuthSuccessResult> {
    const user = await this.userRepo.findByEmailWithRolesAndPermissions(correo);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isValid = await this.passwordHasher.compare(passwordPlain, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return this.createSessionAndTokens(user, context);
  }

  async refreshToken(rawRefreshToken: string, context: ClientContext): Promise<AuthSuccessResult> {
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Token de actualización no proporcionado.');
    }

    const tokenHash = await this.tokenService.hashToken(rawRefreshToken);
    const session = await this.sessionRepo.findByTokenHash(tokenHash);

    if (!session || !session.isValid()) {
      if (session && !session.isRevoked) {
        session.revoke();
        await this.sessionRepo.update(session);
      }
      throw new UnauthorizedException('Sesión inválida o expirada.');
    }

    // Rotación de token: se revoca la sesión activa anterior
    session.revoke();
    await this.sessionRepo.update(session);

    const user = await this.userRepo.findByIdWithRolesAndPermissions(session.idUsuario);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    return this.createSessionAndTokens(user, context);
  }

  async logout(rawRefreshToken: string): Promise<void> {
    if (!rawRefreshToken) return;
    const tokenHash = await this.tokenService.hashToken(rawRefreshToken);
    const session = await this.sessionRepo.findByTokenHash(tokenHash);
    if (session) {
      session.revoke();
      await this.sessionRepo.update(session);
    }
  }

  private async createSessionAndTokens(
    user: AuthUserDetails,
    context: ClientContext,
  ): Promise<AuthSuccessResult> {
    const rawRefreshToken = this.tokenService.generateRefreshToken();
    const refreshTokenHash = await this.tokenService.hashToken(rawRefreshToken);

    const session = Session.create(
      user.idUsuario,
      refreshTokenHash,
      7,
      context.userAgent,
      context.ipAddress,
    );
    await this.sessionRepo.save(session);

    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.idUsuario,
      correo: user.correo,
      rol: user.rol,
      permisos: user.permisos,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        departamento: user.departamento,
        permisos: user.permisos,
      },
    };
  }
}
