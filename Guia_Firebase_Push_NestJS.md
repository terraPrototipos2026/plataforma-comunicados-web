# Implementación de notificaciones push con Firebase Cloud Messaging en NestJS

**Guía técnica integral — 5 de noviembre de 2026**  
**Stack:** NestJS · TypeScript · Firebase Admin SDK · PostgreSQL · TypeORM · Angular (cliente de ejemplo)

> **Objetivo.** Integrar notificaciones push sin reemplazar el backend NestJS ni la base de datos PostgreSQL. Este documento reúne la configuración, el modelo de datos, el código de envío, los endpoints, la integración web, las pruebas y las consideraciones de producción.
>
> **Estado de los ejemplos:** son una base de integración que hay que ajustar a los módulos de autenticación, estructura de usuarios, URL pública y entorno de despliegue del proyecto. No se han ejecutado contra un proyecto Firebase real.

## 1. Qué es Firebase y qué servicio utilizaremos

Firebase es una plataforma de servicios para aplicaciones. **Firebase Cloud Messaging (FCM)** permite distribuir notificaciones push a clientes web y móviles. Para NestJS utilizamos **Firebase Admin SDK** del lado servidor. En el frontend usamos el SDK cliente de Firebase para registrar la instalación y recibir mensajes.

Ejemplos de uso en un sistema académico:

- Aviso de nueva calificación.
- Recordatorio de examen o actividad.
- Alerta por asistencia baja.
- Aviso de cambios en un horario.

FCM es gratuito para el envío de mensajes, pero otros servicios de Firebase o infraestructura complementaria pueden generar costos.

## 2. Arquitectura y flujo

```text
                    1. Permiso + registro FCM
 Angular / web  --------------------------------> Firebase FCM
      |                                               ^
      | 2. FID                                       | 4. Envío
      v                                               |
 NestJS REST API  -->  PostgreSQL                 NestJS NotificationsService
     (JWT)            (push_devices)                    ^
                                                          |
                      3. Evento de negocio ---------------+
                      (ej. nueva calificación)

 Firebase FCM ----> navegador/dispositivo del destinatario
```

**FID:** Firebase Installation ID que identifica una instalación registrada. Desde 2026, Firebase recomienda el flujo `register()` y `onRegistered()` con FIDs. El flujo anterior `getToken()` todavía existe, pero está obsoleto. **No mezclar el campo `fid` con `token` sin adaptar ambos lados.**

El mismo usuario puede tener múltiples instalaciones (PC, celular, otro navegador); por eso la relación lógica es **usuario 1:N dispositivos**.

## 3. Requisitos

- Backend NestJS con autenticación JWT ya implementada o por implementar.
- Node.js **22 o superior** para Firebase Admin SDK 14.x.
- PostgreSQL y TypeORM configurados.
- Proyecto Firebase y una cuenta de servicio.
- Navegador compatible con Push API y HTTPS en producción (localhost puede servir para desarrollo).
- Clave VAPID pública para web push.

> Los ejemplos de `JwtAuthGuard` y `AdminGuard` asumen que ya existen en tu proyecto; sus rutas y propiedades deben adaptarse. No exponer el envío administrativo sin autorización.

## 4. Crear el proyecto Firebase

1. Abre <https://console.firebase.google.com/> y crea el proyecto (por ejemplo, `notificaciones-nestjs`).
2. En **Configuración del proyecto → Cloud Messaging**, verifica que esté habilitada la API **Firebase Cloud Messaging HTTP v1**.
3. En **Configuración del proyecto → Cuentas de servicio → Firebase Admin SDK**, genera una clave privada JSON para el servidor.
4. Guarda el archivo en una ubicación segura que no se suba al repositorio.
5. En **Configuración del proyecto → Cloud Messaging → Web Push certificates**, crea o utiliza un par de claves VAPID y copia su **clave pública** para Angular.
6. Registra una aplicación web en Firebase, y copia `apiKey`, `authDomain`, `projectId`, `appId` y `messagingSenderId` a la configuración pública del frontend.

El archivo JSON de cuenta de servicio es **secreto**. La configuración pública del SDK web y la clave VAPID pública no equivalen a esa credencial privada.

## 5. Instalar paquetes NestJS

```bash
npm install firebase-admin @nestjs/config
npm install @nestjs/typeorm typeorm pg
npm install class-validator class-transformer

nest g module notifications
nest g service notifications
nest g controller notifications
```

Estructura recomendada:

```text
src/
├── firebase/
│   ├── firebase.provider.ts
│   └── firebase.module.ts
├── notifications/
│   ├── dto/
│   │   ├── register-device.dto.ts
│   │   └── send-notification.dto.ts
│   ├── entities/
│   │   └── push-device.entity.ts
│   ├── notifications.service.ts
│   ├── notifications.controller.ts
│   └── notifications.module.ts
├── auth/                      # Guards de tu proyecto
├── app.module.ts
└── main.ts
secrets/
└── firebase-service-account.json    # NUNCA subir a Git
.env
.gitignore
```

`.gitignore`:

```gitignore
.env
.env.*
!.env.example
secrets/
```

`.env`:

```dotenv
GOOGLE_APPLICATION_CREDENTIALS=./secrets/firebase-service-account.json
FIREBASE_PROJECT_ID=notificaciones-nestjs
```

Si el proceso se inicia desde otra carpeta, utiliza una ruta absoluta o configura `GOOGLE_APPLICATION_CREDENTIALS` directamente en el entorno de despliegue. En Google Cloud, considera **Application Default Credentials** sin archivo JSON de larga duración.

## 6. Crear el proveedor Firebase Admin

**`src/firebase/firebase.provider.ts`**

```typescript
import { Provider } from '@nestjs/common';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

export const FIREBASE_MESSAGING = 'FIREBASE_MESSAGING';

export const FirebaseMessagingProvider: Provider = {
  provide: FIREBASE_MESSAGING,
  useFactory: () => {
    const app = getApps()[0] ?? initializeApp({
      credential: applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    return getMessaging(app);
  },
};
```

**`src/firebase/firebase.module.ts`**

```typescript
import { Global, Module } from '@nestjs/common';
import { FirebaseMessagingProvider } from './firebase.provider';

@Global()
@Module({
  providers: [FirebaseMessagingProvider],
  exports: [FirebaseMessagingProvider],
})
export class FirebaseModule {}
```

La inicialización debe ocurrir solamente una vez por proceso. Una alternativa para sistemas que utilizan varias apps de Firebase es darle un nombre explícito a cada instancia.

## 7. Persistir instalaciones en PostgreSQL

No guardes un solo FID en la entidad `Usuario`: una cuenta puede registrar varias instalaciones.

**`src/notifications/entities/push-device.entity.ts`**

```typescript
import {
  Column, CreateDateColumn, Entity, Index,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('push_devices')
export class PushDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'text', unique: true })
  fid: string;

  @Column({ type: 'varchar', length: 20, default: 'web' })
  platform: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

| Columna | Propósito |
|---|---|
| `id` | Identificador del registro. |
| `user_id` | ID del propietario (ajustar al tipo PK real). |
| `fid` | Identificador de instalación registrado en FCM, único. |
| `platform` | `web`, `android` o `ios`. |
| `created_at`, `updated_at` | Fechas de seguimiento. |

En producción, genera una **migración TypeORM** y mantén `synchronize: false`. Si ya existe una entidad de usuario, añade relación y FK según tu esquema. El `fid` es información vinculada a dispositivos y debe protegerse como dato de acceso limitado.

## 8. DTO y validación

**`src/notifications/dto/register-device.dto.ts`**

```typescript
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  @IsNotEmpty()
  fid: string;

  @IsIn(['web', 'android', 'ios'])
  platform: 'web' | 'android' | 'ios';
}
```

**`src/notifications/dto/send-notification.dto.ts`**

```typescript
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  @IsString()
  url?: string;
}
```

**No** aceptes un `userId` enviado por el cliente al registrar su propia instalación: debe obtenerse del JWT validado.

En `src/main.ts`, dentro de `bootstrap()`:

```typescript
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

## 9. Servicio de notificaciones NestJS

**`src/notifications/notifications.service.ts`**

```typescript
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messaging, Message } from 'firebase-admin/messaging';
import { FIREBASE_MESSAGING } from '../firebase/firebase.provider';
import { PushDevice } from './entities/push-device.entity';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(FIREBASE_MESSAGING)
    private readonly messaging: Messaging,
    @InjectRepository(PushDevice)
    private readonly devices: Repository<PushDevice>,
  ) {}

  async registerDevice(userId: string, dto: RegisterDeviceDto) {
    let device = await this.devices.findOne({ where: { fid: dto.fid } });

    if (device) {
      device.userId = userId;
      device.platform = dto.platform;
    } else {
      device = this.devices.create({
        userId,
        fid: dto.fid,
        platform: dto.platform,
      });
    }

    return this.devices.save(device);
  }

  async unregisterDevice(userId: string, fid: string) {
    const result = await this.devices.delete({ userId, fid });
    return { removed: (result.affected ?? 0) > 0 };
  }

  async sendToUser(
    userId: string,
    title: string,
    body: string,
    url?: string,
  ) {
    const rows = await this.devices.find({ where: { userId } });
    const fids = [...new Set(rows.map((row) => row.fid))];

    if (fids.length === 0) {
      return { successCount: 0, failureCount: 0, message: 'Sin dispositivos registrados' };
    }

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < fids.length; i += 500) {
      const batch = fids.slice(i, i + 500);
      const response = await this.messaging.sendEachForMulticast({
        fids: batch,
        notification: { title, body },
        data: url ? { url } : {},
        webpush: {
          fcmOptions: url ? { link: url } : undefined,
        },
      });

      successCount += response.successCount;
      failureCount += response.failureCount;

      for (let j = 0; j < response.responses.length; j++) {
        const item = response.responses[j];
        if (item.success) continue;
        const code = item.error?.code;
        this.logger.warn(`Error de envío FCM: ${code}`);

        // Eliminar únicamente registros definitivamente no registrados.
        if (code === 'messaging/registration-token-not-registered') {
          await this.devices.delete({ fid: batch[j] });
        }
      }
    }

    return { successCount, failureCount };
  }

  async sendToFid(fid: string, title: string, body: string) {
    const message: Message = {
      fid,
      notification: { title, body },
    };
    return this.messaging.send(message);
  }
}
```

**Qué hace:** registra instalaciones, desvincula las asociadas al usuario, consulta todos los FIDs de una cuenta y envía mensajes en lotes de máximo **500**. Procesa los resultados por posición para detectar fallos.

**Limitaciones relevantes:**

1. `successCount` indica aceptación por el servicio FCM, **no confirmación de lectura** ni garantía de visualización.
2. No elimines instalaciones ante cualquier error; pueden existir fallos transitorios de red, cuota o servicio.
3. Para producción agrega reintentos con backoff y manejo explícito de errores; no reintentes indiscriminadamente.
4. Si varias sesiones comparten un navegador, la reasignación de una instalación a otro usuario debe formar parte de una política clara de login/logout.
5. Valida `url` contra dominios autorizados antes de enviarla y no incluyas datos confidenciales en el texto push.
6. La persistencia del registro con patrón `findOne` + `save` puede producir una carrera ante llamadas concurrentes; usa `upsert` o una operación transaccional según la versión de TypeORM si necesitas alta concurrencia.

## 10. Controlador REST y autorización

**`src/notifications/notifications.controller.ts`**

```typescript
import {
  Body, Controller, Delete, Post, Req, UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

// Adaptar estas importaciones al proyecto existente.
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('devices')
  register(@Req() req: any, @Body() dto: RegisterDeviceDto) {
    return this.notifications.registerDevice(String(req.user.id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('devices')
  unregister(@Req() req: any, @Body('fid') fid: string) {
    return this.notifications.unregisterDevice(String(req.user.id), fid);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('send')
  send(@Body() dto: SendNotificationDto) {
    return this.notifications.sendToUser(
      dto.userId, dto.title, dto.body, dto.url,
    );
  }
}
```

El `AdminGuard` es **obligatorio** para impedir que usuarios normales envíen mensajes arbitrarios. Si aún no tienes dicho guard, **no publiques el endpoint `/notifications/send`**. En su lugar, llama al servicio internamente desde eventos de negocio autorizados.

**`src/notifications/notifications.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushDevice } from './entities/push-device.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PushDevice])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
```

En `app.module.ts`, **conserva** tus módulos existentes y agrega:

```typescript
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { NotificationsModule } from './notifications/notifications.module';

// Dentro del array imports del @Module:
ConfigModule.forRoot({ isGlobal: true }),
FirebaseModule,
NotificationsModule,
```

**Endpoints:**

| Método | Endpoint | Permisos | Propósito |
|---|---|---|---|
| POST | `/notifications/devices` | Usuario autenticado | Registra FID propio |
| DELETE | `/notifications/devices` | Usuario autenticado | Desvincula FID propio |
| POST | `/notifications/send` | Administrador | Envía push a un usuario |

Los prefijos (`/api`, `/v1`) dependen de tu configuración NestJS.

## 11. Solicitudes de prueba HTTP

**Registrar instalación:**

```http
POST http://localhost:3000/notifications/devices
Authorization: Bearer TU_JWT
Content-Type: application/json

{
  "fid": "FID_OBTENIDO_DEL_CLIENTE",
  "platform": "web"
}
```

**Enviar notificación:**

```http
POST http://localhost:3000/notifications/send
Authorization: Bearer JWT_DE_ADMINISTRADOR
Content-Type: application/json

{
  "userId": "15",
  "title": "Nueva calificación",
  "body": "Tu nota de Matemáticas está disponible",
  "url": "https://miapp.com/notas"
}
```

**Respuesta posible:**

```json
{
  "successCount": 1,
  "failureCount": 0
}
```

Ese resultado solo se obtiene si hay una instalación registrada y FCM acepta el envío.

## 12. Disparar notificaciones desde otros módulos

El objetivo es no depender del endpoint de prueba administrativo. Cualquier servicio con permisos apropiados puede inyectar `NotificationsService`.

```typescript
import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CalificacionesService {
  constructor(private readonly notifications: NotificationsService) {}

  async notificarCalificacion(estudianteId: string, materia: string) {
    return this.notifications.sendToUser(
      estudianteId,
      'Nueva calificación',
      `Ya está disponible tu calificación de ${materia}`,
      'https://miapp.com/notas',
    );
  }
}
```

En `CalificacionesModule` importa `NotificationsModule`. Llama a `notificarCalificacion()` **después de confirmar** la transacción que guarda la calificación. Para mayor fiabilidad, utiliza una cola (p. ej., BullMQ) y, si hace falta garantizar persistencia del evento, el patrón **outbox**.

## 13. Integración con Angular — registro de FID

Instala el SDK cliente:

```bash
npm install firebase
```

Registra una aplicación **web** en Firebase Console y copia su configuración. En Angular SSR, ejecuta las APIs de navegador solo cuando `window` esté disponible o con `isPlatformBrowser()`.

**Servicio Angular de referencia:**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import {
  getMessaging, isSupported, onMessage,
  onRegistered, onUnregistered, register, unregister,
} from 'firebase/messaging';

@Injectable({ providedIn: 'root' })
export class PushNotificationsService {
  private readonly firebaseApp = initializeApp({
    apiKey: 'TU_API_KEY_PUBLICA',
    authDomain: 'TU_PROYECTO.firebaseapp.com',
    projectId: 'TU_PROYECTO',
    appId: 'TU_APP_ID',
    messagingSenderId: 'TU_SENDER_ID',
  });

  constructor(private readonly http: HttpClient) {}

  async activarNotificaciones() {
    if (typeof window === 'undefined') return;
    if (!(await isSupported())) return;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const messaging = getMessaging(this.firebaseApp);

    onRegistered(messaging, (fid) => {
      // Requiere HttpInterceptor JWT y proxy /api o URL del backend.
      this.http.post('/api/notifications/devices', {
        fid,
        platform: 'web',
      }).subscribe({
        next: () => console.log('FID registrado'),
        error: (err) => console.error('Error al registrar FID', err),
      });
    });

    onUnregistered(messaging, (fid) => {
      this.http.request('DELETE', '/api/notifications/devices', {
        body: { fid },
      }).subscribe();
    });

    onMessage(messaging, (payload) => {
      console.log('Push recibido con página abierta:', payload);
      // Mostrar toast interno si la interfaz lo necesita.
    });

    await register(messaging, { vapidKey: 'TU_CLAVE_VAPID_PUBLICA' });
  }

  // Al cerrar sesión: primero desvincular el FID en tu backend;
  // unregister() desactiva el registro push de esta instalación.
}
```

**Notas:**

- Pide permiso a raíz de una acción explícita del usuario (botón «Activar notificaciones»).
- `register()` inicia el registro y el FID se recibe en `onRegistered()`; **no** en el valor de retorno.
- Configura el interceptor JWT y la URL real de NestJS.
- `onMessage()` gestiona la recepción en primer plano; para segundo plano necesitas un Service Worker apropiado.
- Evita duplicar suscripciones/callbacks si el método se llama repetidamente.
- Al hacer logout, desvincula el dispositivo y define si usarás `unregister(messaging)`; trata cuidadosamente el orden de operaciones y los casos de fallo de red.

## 14. Service Worker y segundo plano

En una aplicación web Firebase requiere un **Service Worker**. Debe estar disponible bajo HTTPS en producción. Una implementación con Firebase compat evita tener que empaquetar imports modulares dentro del propio Service Worker.

Crea `public/firebase-messaging-sw.js` (o la ruta que tu bundler copie a la raíz del sitio):

```javascript
/* global firebase, importScripts */
importScripts('https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'TU_API_KEY_PUBLICA',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  projectId: 'TU_PROYECTO',
  appId: 'TU_APP_ID',
  messagingSenderId: 'TU_SENDER_ID',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Usar para lógica adicional. Si envías el bloque `notification`,
  // el SDK/navegador puede gestionar su visualización automáticamente;
  // no llamar showNotification() sin controlar duplicados.
  console.log('Push en segundo plano:', payload);
});
```

> **Versiones:** las URLs `12.5.0` se ofrecen como ejemplo de ruta compat. Antes de desplegar, sustituye por una **versión existente y compatible** con el SDK `firebase` de tu proyecto. Verifica también si ya hay otro Service Worker (por ejemplo, Angular PWA), para no crear conflictos de scope.

Comprueba la URL pública:

```text
https://tu-dominio.com/firebase-messaging-sw.js
```

Si decides usar un Service Worker propio con otro nombre, regístralo manualmente y pasa `serviceWorkerRegistration` a `register()`.

**Comportamiento esperado:**

- **Primer plano:** `onMessage` recibe el evento; puedes mostrar un toast.
- **Segundo plano:** Service Worker y navegador gestionan el push y, según payload y configuración, su notificación.
- **Aplicación cerrada:** puede mostrarse push si el navegador y el sistema operativo permiten procesos push; no es una garantía universal.

## 15. Seguridad: puntos críticos

1. **Credenciales:** nunca incluyas la cuenta de servicio Firebase Admin en Angular ni en Git.
2. **Autorización:** `POST /notifications/send` debe ser exclusivamente administrativo o servicio interno.
3. **Propiedad del FID:** deriva el propietario desde JWT; al cambiar de cuenta en el mismo navegador, actualiza la asociación y cancela registros anteriores según tu política.
4. **URL del push:** usa una lista permitida de dominios o rutas relativas seguras para impedir redirecciones maliciosas.
5. **Privacidad:** no mandes información sensible directamente en `title`, `body` o `data`; muestra detalles solo después de iniciar sesión.
6. **Abuso:** aplica rate limits, registros de auditoría y restricciones a campañas masivas.
7. **Concurrencia:** usa inserción idempotente y tratamiento de conflictos únicos al registrar FIDs.
8. **Revocación:** al cerrar sesión o eliminar cuenta, desvincula sus dispositivos; considera la ejecución `unregister()` del cliente.
9. **Retención:** limpia identificadores obsoletos y evita guardar dispositivos indefinidamente sin uso.

## 16. Pruebas paso a paso

1. [ ] `npm run start:dev` inicia NestJS sin errores de credenciales.
2. [ ] Existe `push_devices` en PostgreSQL (creada mediante migración).
3. [ ] El usuario inicia sesión y el frontend tiene un JWT válido.
4. [ ] La app web solicita y obtiene permiso de notificaciones.
5. [ ] Firebase registra la instalación y `onRegistered()` recibe el FID.
6. [ ] `POST /notifications/devices` almacena el FID en PostgreSQL.
7. [ ] `POST /notifications/send`, con rol de administrador, devuelve contadores de envío.
8. [ ] Se recibe el mensaje en primer plano y en segundo plano según el tipo de payload.
9. [ ] El clic abre una URL autorizada y preserva la autenticación de la aplicación.
10. [ ] Se comprueba el comportamiento al desactivar las notificaciones, cerrar sesión o eliminar el registro.

Consulta SQL:

```sql
SELECT id, user_id, platform, created_at, updated_at
FROM push_devices;
```

**Importante:** `successCount: 1` NO garantiza que el usuario haya visto el aviso. Para auditar vistas y lecturas necesitas un historial propio y eventos de la interfaz.

## 17. Problemas frecuentes

| Problema | Revisión recomendada |
|---|---|
| `Could not load default credentials` | Archivo o variable `GOOGLE_APPLICATION_CREDENTIALS` incorrecta. |
| `messaging/mismatched-credential` | Configuración cliente y proyecto Firebase del backend diferentes. |
| `messaging/registration-token-not-registered` | Destino retirado o inválido; limpiar registro si es definitivo. |
| `messaging/invalid-argument` | Revisar destinatario, payload y opciones; no borrar automáticamente. |
| Permiso denegado | Revisar configuración del navegador y consentimiento del usuario. |
| Service Worker no encontrado | Revisar ruta pública, MIME, scope y HTTPS. |
| No aparece push con aplicación abierta | Revisar `onMessage`; puede requerirse toast en la UI. |
| No aparece en segundo plano | Revisar Service Worker, permisos, configuración web y navegador. |
| Se duplican notificaciones | Evitar combinar visualización automática con `showNotification()` adicional. |
| Error 401 en `/devices` | JWT, interceptor, guard y `req.user.id`. |
| Error 403 en `/send` | Validar permisos de administrador, no retirar la protección. |

## 18. Mejoras para producción

**Muy recomendadas:**

- **Historial** en `notifications` con `id`, `user_id`, `title`, `body`, `type`, `created_at`, `read_at`.
- **Preferencias** de notificación por usuario y categoría.
- **BullMQ** para envío asíncrono, control de carga y reintentos.
- **Outbox** para publicar eventos después de confirmar transacciones de negocio.
- **Limpieza periódica** de registros obsoletos.
- **Monitoreo** de aceptaciones, errores, reintentos y latencia.
- **Idempotencia** para evitar avisos repetidos si un job se reejecuta.
- **Pruebas** unitarias mockeando `Messaging`, pruebas de API con roles y pruebas integradas en navegadores de destino.

### Modelo adicional opcional: historial

```text
notifications
- id (UUID)
- user_id (FK o identificador existente)
- title
- body
- type
- target_url
- created_at
- read_at (nullable)
```

El estado `read_at` lo debe actualizar tu aplicación cuando el usuario lea el aviso; FCM no lo aporta directamente como una garantía de lectura.

## 19. Resumen de implementación

1. Crear proyecto Firebase, activar FCM y obtener credenciales de servicio y VAPID.
2. Instalar `firebase-admin` y añadir `FirebaseModule` en NestJS.
3. Crear migración y entidad `push_devices` para FIDs por usuario.
4. Crear DTO, `NotificationsService`, `NotificationsController`, `NotificationsModule`.
5. Proteger los endpoints usando JWT y control de acceso administrativo.
6. Registrar FIDs desde Angular mediante `register()` + `onRegistered()`.
7. Configurar Service Worker y probar recepción en segundo plano.
8. Integrar avisos en eventos reales, luego añadir colas, historial y controles operativos.

## 20. Referencias oficiales (consultadas el 5 de noviembre de 2026)

- Firebase Admin SDK — configuración: <https://firebase.google.com/docs/admin/setup>
- Firebase Cloud Messaging — enviar mediante Admin SDK, FIDs y multicast: <https://firebase.google.com/docs/cloud-messaging/send/admin-sdk>
- Firebase Cloud Messaging web — primeros pasos: <https://firebase.google.com/docs/cloud-messaging/web/get-started>
- Firebase Cloud Messaging web — recepción y Service Workers: <https://firebase.google.com/docs/cloud-messaging/web/receive-messages>
- Firebase Messaging JavaScript API — `register`, `onRegistered`, `onUnregistered`: <https://firebase.google.com/docs/reference/js/messaging>
- Firebase Admin SDK — notas de versiones y soporte de Node.js: <https://firebase.google.com/support/release-notes/admin/node>
- Buenas prácticas de gestión de registros: <https://firebase.google.com/docs/cloud-messaging/manage-tokens>

---

**Nota final:** esta guía incorpora la transición recomendada a FIDs y mantiene el backend separado del servicio FCM. Se requiere adaptar autenticación, migraciones, permisos y versiones del SDK al repositorio específico antes de desplegar.
