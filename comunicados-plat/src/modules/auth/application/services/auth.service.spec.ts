import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service.js';
import type { PasswordHasherPort } from '../ports/password-hasher.port.js';
import type { TokenServicePort } from '../ports/token-service.port.js';
import type { AuthUserRepositoryPort, AuthUserDetails } from '../../domain/ports/auth-user.repository.port.js';
import type { SessionRepositoryPort } from '../../domain/ports/session.repository.port.js';
import { Session } from '../../domain/entities/session.entity.js';
import { UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';

describe('AuthService (Clean Architecture Isolated Unit Test)', () => {
  let authService: AuthService;
  let mockPasswordHasher: PasswordHasherPort;
  let mockTokenService: TokenServicePort;
  let mockUserRepo: AuthUserRepositoryPort;
  let mockSessionRepo: SessionRepositoryPort;

  const sampleUser: AuthUserDetails = {
    idUsuario: 'user-uuid-123',
    nombre: 'Juan Perez',
    correo: 'juan@terra.com',
    password: '$argon2id$v=19$m=65536,t=3,p=1$hash',
    telefono: '123456789',
    idRol: 'rol-uuid-001',
    rol: 'administrador general',
    idDepartamento: 'dept-uuid-002',
    departamento: 'sistemas',
    permisos: ['comunicados:create', 'comunicados:read'],
  };

  beforeEach(() => {
    mockPasswordHasher = {
      hash: vi.fn().mockResolvedValue('hashed-password'),
      compare: vi.fn(),
    };

    mockTokenService = {
      generateAccessToken: vi.fn().mockResolvedValue('jwt-access-token'),
      generateRefreshToken: vi.fn().mockReturnValue('opaque-refresh-token'),
      verifyAccessToken: vi.fn(),
      hashToken: vi.fn().mockImplementation((t: string) => Promise.resolve(`hash_${t}`)),
    };

    mockUserRepo = {
      create: vi.fn().mockResolvedValue('new-user-id'),
      findByEmail: vi.fn(),
      findByEmailWithRolesAndPermissions: vi.fn(),
      findByIdWithRolesAndPermissions: vi.fn(),
      findRoleIdByName: vi.fn().mockResolvedValue('rol-uuid-001'),
      findDepartmentIdByName: vi.fn().mockResolvedValue('dept-uuid-002'),
    };

    mockSessionRepo = {
      findById: vi.fn(),
      findByTokenHash: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      update: vi.fn().mockResolvedValue(undefined),
      revokeAllForUser: vi.fn().mockResolvedValue(undefined),
    };

    authService = new AuthService(
      mockPasswordHasher,
      mockTokenService,
      mockUserRepo,
      mockSessionRepo,
    );
  });

  describe('register', () => {
    it('debe registrar un usuario exitosamente buscando el UUID del rol y departamento por nombre', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);

      const result = await authService.register({
        nombre: 'Carlos',
        correo: 'carlos@terra.com',
        password: 'Password123',
        rol: 'administrador general',
        departamento: 'sistemas',
      });

      expect(mockUserRepo.findRoleIdByName).toHaveBeenCalledWith('administrador general');
      expect(mockUserRepo.findDepartmentIdByName).toHaveBeenCalledWith('sistemas');
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith('Password123');
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        nombre: 'Carlos',
        correo: 'carlos@terra.com',
        password: 'hashed-password',
        telefono: undefined,
        idRol: 'rol-uuid-001',
        idDepartamento: 'dept-uuid-002',
      });
      expect(result).toEqual({ idUsuario: 'new-user-id', correo: 'carlos@terra.com' });
    });

    it('debe lanzar ConflictException si el correo ya existe', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(sampleUser);

      await expect(
        authService.register({
          nombre: 'Carlos',
          correo: 'juan@terra.com',
          password: 'Password123',
          rol: 'administrador general',
          departamento: 'sistemas',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('debe lanzar NotFoundException si el rol no existe', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);
      vi.mocked(mockUserRepo.findRoleIdByName).mockResolvedValue(null);

      await expect(
        authService.register({
          nombre: 'Carlos',
          correo: 'carlos@terra.com',
          password: 'Password123',
          rol: 'rol-inexistente',
          departamento: 'sistemas',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si el departamento no existe', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);
      vi.mocked(mockUserRepo.findDepartmentIdByName).mockResolvedValue(null);

      await expect(
        authService.register({
          nombre: 'Carlos',
          correo: 'carlos@terra.com',
          password: 'Password123',
          rol: 'administrador general',
          departamento: 'depto-inexistente',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('login', () => {
    it('debe iniciar sesión, emitir access token, refresh token y guardar la sesión persistente', async () => {
      vi.mocked(mockUserRepo.findByEmailWithRolesAndPermissions).mockResolvedValue(sampleUser);
      vi.mocked(mockPasswordHasher.compare).mockResolvedValue(true);

      const result = await authService.login('juan@terra.com', 'Password123', {
        userAgent: 'Mozilla/5.0',
        ipAddress: '127.0.0.1',
      });

      expect(mockPasswordHasher.compare).toHaveBeenCalledWith('Password123', sampleUser.password);
      expect(mockSessionRepo.save).toHaveBeenCalled();
      expect(result.accessToken).toBe('jwt-access-token');
      expect(result.refreshToken).toBe('opaque-refresh-token');
      expect(result.user.rol).toBe('administrador general');
      expect(result.user.permisos).toEqual(['comunicados:create', 'comunicados:read']);
    });

    it('debe lanzar UnauthorizedException ante contraseña incorrecta', async () => {
      vi.mocked(mockUserRepo.findByEmailWithRolesAndPermissions).mockResolvedValue(sampleUser);
      vi.mocked(mockPasswordHasher.compare).mockResolvedValue(false);

      await expect(
        authService.login('juan@terra.com', 'WrongPassword', {}),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken (rotación de tokens)', () => {
    it('debe rotar tokens: revocar la sesión anterior y generar una nueva sesión válida', async () => {
      const activeSession = Session.create('user-uuid-123', 'hash_old_token', 7);
      vi.mocked(mockSessionRepo.findByTokenHash).mockResolvedValue(activeSession);
      vi.mocked(mockUserRepo.findByIdWithRolesAndPermissions).mockResolvedValue(sampleUser);

      const result = await authService.refreshToken('old_token', {});

      expect(activeSession.isRevoked).toBe(true);
      expect(mockSessionRepo.update).toHaveBeenCalledWith(activeSession);
      expect(mockSessionRepo.save).toHaveBeenCalled(); // Guarda la nueva sesión
      expect(result.accessToken).toBe('jwt-access-token');
      expect(result.refreshToken).toBe('opaque-refresh-token');
    });

    it('debe lanzar UnauthorizedException si la sesión ya fue revocada', async () => {
      const revokedSession = Session.create('user-uuid-123', 'hash_revoked', 7);
      revokedSession.revoke();
      vi.mocked(mockSessionRepo.findByTokenHash).mockResolvedValue(revokedSession);

      await expect(authService.refreshToken('revoked_token', {})).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('debe revocar la sesión en la base de datos', async () => {
      const activeSession = Session.create('user-uuid-123', 'hash_token', 7);
      vi.mocked(mockSessionRepo.findByTokenHash).mockResolvedValue(activeSession);

      await authService.logout('current_token');

      expect(activeSession.isRevoked).toBe(true);
      expect(mockSessionRepo.update).toHaveBeenCalledWith(activeSession);
    });
  });
});

