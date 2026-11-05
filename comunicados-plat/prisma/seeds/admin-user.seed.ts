import { type PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

export const ADMIN_USER_SEED_DATA = {
  nombre: process.env.ADMIN_NAME ?? 'Administrador General',
  correo: process.env.ADMIN_EMAIL ?? 'admin@terra.com',
  password: process.env.ADMIN_PASSWORD ?? 'Admin123*',
  telefono: process.env.ADMIN_PHONE ?? '+591 70000000',
  rol: 'administrador general',
  departamento: process.env.ADMIN_DEPARTMENT ?? 'sistemas',
};

export async function seedAdminUser(prisma: PrismaClient) {
  console.log('🌱 Sembrando usuario administrador general...');

  const rol = await prisma.roles.upsert({
    where: { nombre: ADMIN_USER_SEED_DATA.rol },
    update: {},
    create: { nombre: ADMIN_USER_SEED_DATA.rol },
  });

  const departamento = await prisma.departamento.upsert({
    where: { nombre: ADMIN_USER_SEED_DATA.departamento },
    update: {},
    create: { nombre: ADMIN_USER_SEED_DATA.departamento },
  });

  const existingUser = await prisma.usuario.findUnique({
    where: { correo: ADMIN_USER_SEED_DATA.correo },
  });

  if (existingUser) {
    console.log(
      `  ✓ Usuario administrador ya existente: [id: ${existingUser.idUsuario}] "${existingUser.correo}"`,
    );
    return existingUser;
  }

  const passwordHash = await argon2.hash(ADMIN_USER_SEED_DATA.password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });

  const adminUser = await prisma.usuario.create({
    data: {
      nombre: ADMIN_USER_SEED_DATA.nombre,
      correo: ADMIN_USER_SEED_DATA.correo,
      password: passwordHash,
      telefono: ADMIN_USER_SEED_DATA.telefono,
      idRol: rol.idRol,
      idDepartamento: departamento.idDepartamento,
    },
  });

  console.log(
    `  ✓ Usuario administrador creado: [id: ${adminUser.idUsuario}] "${adminUser.correo}" (Rol: "${rol.nombre}", Depto: "${departamento.nombre}")`,
  );

  return adminUser;
}

