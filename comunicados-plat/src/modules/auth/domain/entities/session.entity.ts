export interface SessionProps {
  idSesion: string;
  idUsuario: string;
  refreshTokenHash: string;
  fechaInicio: Date;
  fechaExpiracion: Date;
  isRevoked: boolean;
  userAgent?: string | null;
  ipAddress?: string | null;
}

export class Session {
  private constructor(private readonly props: SessionProps) {}

  public static create(
    idUsuario: string,
    refreshTokenHash: string,
    expiresInDays = 7,
    userAgent?: string | null,
    ipAddress?: string | null,
  ): Session {
    const now = new Date();
    const expiration = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);

    return new Session({
      idSesion: crypto.randomUUID(),
      idUsuario,
      refreshTokenHash,
      fechaInicio: now,
      fechaExpiracion: expiration,
      isRevoked: false,
      userAgent: userAgent ?? null,
      ipAddress: ipAddress ?? null,
    });
  }

  public static reconstitute(props: SessionProps): Session {
    return new Session(props);
  }

  public revoke(): void {
    this.props.isRevoked = true;
  }

  public isExpired(): boolean {
    return new Date() > this.props.fechaExpiracion;
  }

  public isValid(): boolean {
    return !this.props.isRevoked && !this.isExpired();
  }

  public get idSesion(): string {
    return this.props.idSesion;
  }

  public get idUsuario(): string {
    return this.props.idUsuario;
  }

  public get refreshTokenHash(): string {
    return this.props.refreshTokenHash;
  }

  public get fechaInicio(): Date {
    return this.props.fechaInicio;
  }

  public get fechaExpiracion(): Date {
    return this.props.fechaExpiracion;
  }

  public get isRevoked(): boolean {
    return this.props.isRevoked;
  }

  public get userAgent(): string | null | undefined {
    return this.props.userAgent;
  }

  public get ipAddress(): string | null | undefined {
    return this.props.ipAddress;
  }
}

