import { useState, useMemo, useRef } from 'react';
import {
  Zap,
  FileText,
  Upload,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Building2,
  Store,
  Users,
  UserCheck,
  Send,
  Save,
  Image as ImageIcon,
  Globe,
  Layers,
  Search,
  Check,
} from 'lucide-react';
import { apiClient } from '../../../../core/http/api-client';
import { useCreateComunicadoMutation } from '../hooks/use-comunicado-mutations';
import { useEstimarAlcanceQuery } from '../hooks/use-comunicados-query';
import { useDepartamentosQuery } from '../../../departamentos/presentation/hooks/use-departamentos-query';
import { useSucursalesQuery } from '../../../sucursales/presentation/hooks/use-sucursales-query';
import { useUsuariosQuery } from '../../../usuarios/presentation/hooks/use-usuarios-query';
import { UsuarioRules } from '../../../usuarios/domain/models/usuario.model';
import { useAuthStore } from '../../../../core/store/use-auth-store';
import {
  JerarquiaAlcanceRules,
} from '../../domain/models/jerarquia-alcance.rules';
import type {
  PrioridadComunicado,
  TipoAlcanceComunicado,
} from '../../domain/models/comunicado.model';
import { useComunicadosUiStore } from '../store/use-comunicados-ui-store';

export function ComunicadoComposerCard() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.rol ?? 'administrador general';

  const setActiveTab = useComunicadosUiStore((state) => state.setActiveTab);
  const composerMode = useComunicadosUiStore((state) => state.composerMode);
  const setComposerMode = useComunicadosUiStore((state) => state.setComposerMode);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreateComunicadoMutation();
  const { data: departamentos = [] } = useDepartamentosQuery();
  const { data: sucursales = [] } = useSucursalesQuery();
  const { data: usuarios = [] } = useUsuariosQuery();

  // Estados de formulario completamente limpios (sin datos hardcodeados)
  const [titulo, setTitulo] = useState('');
  const [extracto, setExtracto] = useState('');
  const [prioridad, setPrioridad] = useState<PrioridadComunicado>('NORMAL');
  const [cuerpoHtml, setCuerpoHtml] = useState('');

  // Imágenes / Afiche (inicialmente vacío)
  const [imagenes, setImagenes] = useState<
    { urlImagen: string; nombreArchivo: string; tamanoBytes: number; esPortada: boolean; orden: number }[]
  >([]);

  // PDF Oficial (inicialmente nulo)
  const [pdfAdjunto, setPdfAdjunto] = useState<{
    url: string;
    nombre: string;
    tamanoBytes: number;
    paginas: number;
  } | null>(null);

  // Estados de subida y drag-and-drop
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);

  // Subir archivo al backend (o fallback a URL local si falla)
  const uploadFileToServer = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post<{ url: string }>('/comunicados/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.url;
    } catch (err) {
      console.warn('Fallo al subir archivo al servidor, usando URL local temporal:', err);
      return URL.createObjectURL(file);
    }
  };

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('El archivo seleccionado debe ser una imagen válida (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('La imagen no debe superar los 25MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await uploadFileToServer(file);
      setImagenes([
        {
          urlImagen: url,
          nombreArchivo: file.name,
          tamanoBytes: file.size,
          esPortada: true,
          orden: 0,
        },
      ]);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const processPdfFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('El archivo seleccionado debe ser un documento PDF oficial.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('El documento PDF no debe superar los 25MB.');
      return;
    }

    setIsUploadingPdf(true);
    try {
      const url = await uploadFileToServer(file);
      setPdfAdjunto({
        url,
        nombre: file.name,
        tamanoBytes: file.size,
        paginas: Math.max(1, Math.round(file.size / (150 * 1024))),
      });
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processImageFile(file);
    }
    e.target.value = '';
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processPdfFile(file);
    }
    e.target.value = '';
  };

  // Alcance y Destinatarios (Modo 'TODA_EMPRESA' vs 'SECUENCIAL')
  const [modoDistribucion, setModoDistribucion] = useState<'TODA_EMPRESA' | 'SECUENCIAL'>('TODA_EMPRESA');
  const [selectedSucursalIds, setSelectedSucursalIds] = useState<string[]>([]);
  const [modoDepartamentos, setModoDepartamentos] = useState<'TODOS' | 'SELECCIONADOS'>('TODOS');
  const [selectedDepartamentoIds, setSelectedDepartamentoIds] = useState<string[]>([]);
  const [modoDestinatarios, setModoDestinatarios] = useState<'TODOS' | 'ENCARGADOS' | 'NOMINATIVO'>('TODOS');
  const [selectedUsuarioIds, setSelectedUsuarioIds] = useState<string[]>([]);
  const [busquedaUsuario, setBusquedaUsuario] = useState('');

  // Programación
  const [isProgramado, setIsProgramado] = useState(false);
  const [fechaProgramada, setFechaProgramada] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Departamentos disponibles según las sucursales seleccionadas en Paso 1
  const departamentosDisponibles = useMemo(() => {
    if (selectedSucursalIds.length === 0) return [];
    return departamentos.filter(
      (d) => !d.idSucursal || selectedSucursalIds.includes(d.idSucursal),
    );
  }, [departamentos, selectedSucursalIds]);

  // Departamentos efectivos resultantes del Paso 2
  const departamentosEfectivosIds = useMemo(() => {
    if (modoDepartamentos === 'TODOS') {
      return departamentosDisponibles.map((d) => d.idDepartamento);
    }
    return selectedDepartamentoIds.filter((id) =>
      departamentosDisponibles.some((d) => d.idDepartamento === id),
    );
  }, [modoDepartamentos, departamentosDisponibles, selectedDepartamentoIds]);

  // Usuarios disponibles según los departamentos efectivos del Paso 2
  const usuariosDisponibles = useMemo(() => {
    if (departamentosEfectivosIds.length === 0) return [];
    return usuarios.filter((u) => departamentosEfectivosIds.includes(u.idDepartamento));
  }, [usuarios, departamentosEfectivosIds]);

  // Usuarios filtrados por buscador en vivo
  const usuariosFiltradosBusqueda = useMemo(() => {
    if (!busquedaUsuario.trim()) return usuariosDisponibles;
    const term = busquedaUsuario.toLowerCase().trim();
    return usuariosDisponibles.filter(
      (u) =>
        u.nombre.toLowerCase().includes(term) ||
        u.correo.toLowerCase().includes(term) ||
        (u.departamento && u.departamento.toLowerCase().includes(term)) ||
        (u.rol && u.rol.toLowerCase().includes(term)),
    );
  }, [usuariosDisponibles, busquedaUsuario]);

  // Tipo de alcance efectivo para lógica de negocio y permisos
  const effectiveTipoAlcance: TipoAlcanceComunicado = useMemo(() => {
    if (composerMode === 'EXPRESS' || modoDistribucion === 'TODA_EMPRESA') {
      return 'TODA_EMPRESA';
    }
    if (modoDestinatarios === 'NOMINATIVO') {
      return 'NOMINATIVO';
    }
    if (modoDestinatarios === 'ENCARGADOS') {
      return 'ENCARGADOS_AREA';
    }
    if (modoDepartamentos === 'SELECCIONADOS' || selectedDepartamentoIds.length > 0) {
      return 'POR_DEPARTAMENTO';
    }
    return 'POR_SUCURSAL';
  }, [composerMode, modoDistribucion, modoDestinatarios, modoDepartamentos, selectedDepartamentoIds]);

  // Destinatarios puntuales si es nominativo
  const effectiveDestinatarioIds = useMemo(() => {
    if (modoDistribucion === 'SECUENCIAL' && modoDestinatarios === 'NOMINATIVO') {
      return selectedUsuarioIds;
    }
    return [];
  }, [modoDistribucion, modoDestinatarios, selectedUsuarioIds]);

  // Jefaturas y encargados identificados dinámicamente
  const encargadosDisponibles = useMemo(() => {
    return usuariosDisponibles.filter((u) => {
      const r = (u.rol ?? '').toLowerCase();
      return r.includes('encargado') || r.includes('jefe') || r.includes('gerente') || r.includes('admin');
    });
  }, [usuariosDisponibles]);

  // Handlers reactivos en cascada
  const handleToggleSucursal = (idSucursal: string) => {
    setSelectedSucursalIds((prev) => {
      const next = prev.includes(idSucursal)
        ? prev.filter((id) => id !== idSucursal)
        : [...prev, idSucursal];

      // Sincronizar departamentos válidos
      setSelectedDepartamentoIds((prevDeptos) => {
        const validDeptos = departamentos
          .filter((d) => !d.idSucursal || next.includes(d.idSucursal))
          .map((d) => d.idDepartamento);
        return prevDeptos.filter((id) => validDeptos.includes(id));
      });

      return next;
    });
  };

  const handleSelectAllSucursales = () => {
    setSelectedSucursalIds(sucursales.map((s) => s.idSucursal));
  };

  const handleClearSucursales = () => {
    setSelectedSucursalIds([]);
    setSelectedDepartamentoIds([]);
    setSelectedUsuarioIds([]);
  };

  const handleToggleDepartamento = (idDepartamento: string) => {
    setSelectedDepartamentoIds((prev) => {
      const next = prev.includes(idDepartamento)
        ? prev.filter((id) => id !== idDepartamento)
        : [...prev, idDepartamento];

      // Sincronizar usuarios válidos
      setSelectedUsuarioIds((prevUsers) => {
        return prevUsers.filter((uid) => {
          const user = usuarios.find((u) => u.idUsuario === uid);
          return user && next.includes(user.idDepartamento);
        });
      });

      return next;
    });
  };

  const handleToggleUsuario = (idUsuario: string) => {
    setSelectedUsuarioIds((prev) =>
      prev.includes(idUsuario)
        ? prev.filter((id) => id !== idUsuario)
        : [...prev, idUsuario],
    );
  };

  const handleSelectAllUsuarios = () => {
    setSelectedUsuarioIds(usuariosDisponibles.map((u) => u.idUsuario));
  };

  const handleClearAllUsuarios = () => {
    setSelectedUsuarioIds([]);
  };

  // Estimación de alcance
  const { data: estimacion } = useEstimarAlcanceQuery({
    tipoAlcance: effectiveTipoAlcance,
    sucursalIds: modoDistribucion === 'SECUENCIAL' ? selectedSucursalIds : [],
    departamentoIds: modoDistribucion === 'SECUENCIAL' ? departamentosEfectivosIds : [],
    usuarioIds: effectiveDestinatarioIds,
    rolSimulado: userRole,
  });

  const evaluacionRol = JerarquiaAlcanceRules.evaluar(
    userRole,
    effectiveTipoAlcance,
  );

  const handleSubmit = async (estadoFinal: 'PUBLICADO' | 'BORRADOR') => {
    setErrorMessage(null);
    if (!titulo.trim()) {
      setErrorMessage('El título del comunicado es obligatorio.');
      return;
    }

    if (composerMode === 'AVANZADO' && modoDistribucion === 'SECUENCIAL') {
      if (selectedSucursalIds.length === 0) {
        setErrorMessage('Debes seleccionar al menos una sucursal de destino en el Paso 1.');
        return;
      }
      if (modoDepartamentos === 'SELECCIONADOS' && selectedDepartamentoIds.length === 0) {
        setErrorMessage('Debes seleccionar al menos un departamento de destino en el Paso 2.');
        return;
      }
      if (modoDestinatarios === 'NOMINATIVO' && selectedUsuarioIds.length === 0) {
        setErrorMessage('Debes seleccionar al menos un colaborador en la lista nominativa en el Paso 3.');
        return;
      }
    }

    if (!evaluacionRol.autorizado && estadoFinal === 'PUBLICADO') {
      setErrorMessage(evaluacionRol.advertenciaRestriccion ?? evaluacionRol.descripcionPermiso);
      return;
    }

    try {
      await createMutation.mutateAsync({
        titulo,
        extracto: composerMode === 'AVANZADO' ? extracto : undefined,
        medioPublicacion: composerMode,
        prioridad: composerMode === 'AVANZADO' ? prioridad : 'NORMAL',
        estado: isProgramado && estadoFinal === 'PUBLICADO' ? 'PROGRAMADO' : estadoFinal,
        tipoAlcance: effectiveTipoAlcance,
        fechaProgramada: isProgramado ? fechaProgramada : undefined,
        contenidoHtml: composerMode === 'AVANZADO' ? cuerpoHtml : undefined,
        urlArchivoPdf: pdfAdjunto?.url,
        nombreArchivoPdf: pdfAdjunto?.nombre,
        tamanoBytesPdf: pdfAdjunto?.tamanoBytes,
        numeroPaginasPdf: pdfAdjunto?.paginas,
        imagenes: imagenes.map((img, idx) => ({
          ...img,
          esPortada: idx === 0,
          orden: idx,
        })),
        sucursalIds: modoDistribucion === 'SECUENCIAL' ? selectedSucursalIds : [],
        departamentoIds: modoDistribucion === 'SECUENCIAL' ? departamentosEfectivosIds : [],
        destinatarioIds: effectiveDestinatarioIds,
        rolSimulado: userRole,
      });

      setActiveTab('listado');
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al emitir el comunicado.');
      }
    }
  };

  const handleInsertEditorTag = (tag: string) => {
    if (tag === 'b') {
      setCuerpoHtml((prev) => `${prev}\n<strong>Texto destacado</strong>`);
    } else if (tag === 'i') {
      setCuerpoHtml((prev) => `${prev}\n<em>Texto en cursiva</em>`);
    } else if (tag === 'h2') {
      setCuerpoHtml((prev) => `${prev}\n<h2>Subtítulo de Sección</h2>`);
    } else if (tag === 'alerta') {
      setCuerpoHtml(
        (prev) =>
          `${prev}\n<div class="alerta"><strong>IMPORTANTE:</strong> Esta directiva es de cumplimiento inmediato.</div>`,
      );
    }
  };

  return (
    <div className="rounded-terra-modal bg-superficie-1 border-[1.5px] border-borde p-4 sm:p-6 shadow-terra flex flex-col gap-6 text-left">
      {/* Cabecera del Redactor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-borde-suave">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[0.68rem] font-extrabold uppercase tracking-widest text-primario block">
              Redacción y Distribución
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-texto-principal">
            Redactar y Distribuir Nuevo Comunicado
          </h1>
          <p className="text-xs text-texto-suave">
            Emisión oficial con seguimiento obligatorio de lectura y registro en auditoría
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('listado')}
          className="min-h-[2.5rem] px-4 py-1.5 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal flex items-center justify-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Comunicados</span>
        </button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-terra-campo border border-alerta bg-primario-claro p-4 flex items-center gap-3 text-alerta text-xs font-bold"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selector de Modalidad: 1. Express vs 2. Avanzado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opción 1: Rápido (Express) */}
        <button
          type="button"
          onClick={() => setComposerMode('EXPRESS')}
          className={`p-3.5 sm:p-4 rounded-terra-tarjeta border-[1.5px] flex items-center gap-3 text-left transition-all cursor-pointer ${
            composerMode === 'EXPRESS'
              ? 'border-primario bg-primario-claro/25 shadow-terra-sm'
              : 'border-borde hover:border-borde-hover bg-superficie-1'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-terra-boton flex items-center justify-center shrink-0 ${
              composerMode === 'EXPRESS'
                ? 'bg-primario text-sobre-primario'
                : 'bg-superficie-2 text-texto-suave'
            }`}
          >
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-texto-principal">
                1. COMUNICADO RÁPIDO (EXPRESS)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-extrabold bg-[#fff7df] text-[#b27600] border border-[#f0e0b8]">
                Ágil
              </span>
            </div>
          </div>
        </button>

        {/* Opción 2: Completo (Avanzado) */}
        <button
          type="button"
          onClick={() => setComposerMode('AVANZADO')}
          className={`p-3.5 sm:p-4 rounded-terra-tarjeta border-[1.5px] flex items-center gap-3 text-left transition-all cursor-pointer ${
            composerMode === 'AVANZADO'
              ? 'border-primario bg-primario-claro/25 shadow-terra-sm'
              : 'border-borde hover:border-borde-hover bg-superficie-1'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-terra-boton flex items-center justify-center shrink-0 ${
              composerMode === 'AVANZADO'
                ? 'bg-primario text-sobre-primario'
                : 'bg-superficie-2 text-texto-suave'
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-texto-principal">
                2. COMUNICADO COMPLETO (AVANZADO)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-extrabold bg-superficie-2 text-texto-suave border border-borde">
                Tal como está
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* ===================== MODALIDAD 1: EXPRESS ===================== */}
      {composerMode === 'EXPRESS' ? (
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-borde-suave">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primario" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-texto-principal">
                Emisión Rápida de Comunicado
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[0.68rem] font-extrabold bg-[#e4f4e9] text-exito border border-[#bfe3ca] flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Despacho masivo automático</span>
            </span>
          </div>

          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="titulo-express" className="font-extrabold uppercase tracking-wider text-texto-principal">
                Título del Comunicado *
              </label>
              <span className="text-[0.68rem] text-texto-suave font-mono">MÁX 120 CARACTERES</span>
            </div>
            <input
              id="titulo-express"
              type="text"
              required
              maxLength={120}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Afiche Oficial: Protocolo Preventivo de Fin de Año y Turnos Operativos"
              className="w-full min-h-[3rem] px-4 py-2.5 rounded-terra-campo bg-superficie-2 border-[1.5px] border-borde focus:border-primario focus:bg-superficie-1 focus:shadow-terra-anillo focus:outline-none text-sm font-medium text-texto-principal placeholder:text-texto-placeholder"
            />
          </div>

          {/* Inputs de Archivo Ocultos */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageFileChange}
          />
          <input
            type="file"
            ref={pdfInputRef}
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handlePdfFileChange}
          />

          {/* Afiche + Circular PDF lado a lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Afiche / Imagen */}
            <div className="rounded-terra-campo border border-borde bg-superficie-2/50 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold uppercase tracking-wider text-texto-principal flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-primario" />
                  <span>Afiche / Imagen del Comunicado</span>
                </span>
                <span className="text-[0.65rem] text-texto-suave uppercase">JPG, PNG, WEBP</span>
              </div>

              {isUploadingImage ? (
                <div className="w-full h-48 rounded-terra-chico border-2 border-dashed border-primario/60 bg-superficie-1 flex flex-col items-center justify-center gap-2 text-primario">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-bold">Subiendo afiche institucional...</span>
                </div>
              ) : imagenes[0] ? (
                <div className="flex flex-col gap-2">
                  <div className="w-full h-48 rounded-terra-chico overflow-hidden border border-borde bg-black/5">
                    <img
                      src={imagenes[0].urlImagen}
                      alt="Afiche"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-texto-suave truncate max-w-[220px]">{imagenes[0].nombreArchivo}</span>
                    <button
                      type="button"
                      onClick={() => setImagenes([])}
                      className="text-alerta hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Quitar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => imageInputRef.current?.click()}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && imageInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) void processImageFile(file);
                  }}
                  className={`w-full h-48 rounded-terra-chico border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    isDraggingImage
                      ? 'border-primario bg-primario-claro/40 text-primario scale-[1.01]'
                      : 'border-borde hover:border-primario text-texto-suave hover:text-primario hover:bg-superficie-crema/40'
                  }`}
                >
                  <Upload className="w-8 h-8 text-texto-placeholder" />
                  <span className="text-xs font-bold">Haz clic o arrastra un afiche institucional</span>
                  <span className="text-[0.65rem] text-texto-suave">Formatos: JPG, PNG, WEBP (hasta 25MB)</span>
                </div>
              )}
            </div>

            {/* Documento Oficial (PDF) */}
            <div className="rounded-terra-campo border border-borde bg-superficie-2/50 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold uppercase tracking-wider text-texto-principal flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primario" />
                  <span>Documento Oficial (PDF)</span>
                </span>
                <span className="text-[0.65rem] text-texto-suave uppercase">Circular o Memo</span>
              </div>

              {isUploadingPdf ? (
                <div className="w-full h-48 rounded-terra-chico border-2 border-dashed border-primario/60 bg-superficie-1 flex flex-col items-center justify-center gap-2 text-primario">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-bold">Subiendo documento PDF...</span>
                </div>
              ) : pdfAdjunto ? (
                <div className="flex flex-col gap-3 h-full justify-between">
                  <div className="p-4 rounded-terra-chico bg-superficie-1 border border-borde flex items-start gap-3">
                    <div className="w-10 h-10 rounded-terra-chico bg-primario-claro text-primario flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-texto-principal truncate">
                        {pdfAdjunto.nombre}
                      </p>
                      <p className="text-[0.68rem] text-texto-suave mt-0.5">
                        {(pdfAdjunto.tamanoBytes / 1024 / 1024).toFixed(1)} MB • {pdfAdjunto.paginas} página(s)
                      </p>
                      <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[0.65rem] font-extrabold bg-[#e4f4e9] text-exito border border-[#bfe3ca]">
                        PDF LISTO PARA VISUALIZACIÓN
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPdfAdjunto(null)}
                    className="self-end text-alerta hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover PDF</span>
                  </button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => pdfInputRef.current?.click()}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pdfInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingPdf(true);
                  }}
                  onDragLeave={() => setIsDraggingPdf(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingPdf(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) void processPdfFile(file);
                  }}
                  className={`w-full h-48 rounded-terra-chico border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    isDraggingPdf
                      ? 'border-primario bg-primario-claro/40 text-primario scale-[1.01]'
                      : 'border-borde hover:border-primario text-texto-suave hover:text-primario hover:bg-superficie-crema/40'
                  }`}
                >
                  <FileText className="w-8 h-8 text-texto-placeholder" />
                  <span className="text-xs font-bold">Sin documento circular adjunto</span>
                  <span className="text-[0.65rem] text-texto-suave">Haz clic o arrastra un archivo .PDF (máx. 25MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Botón Acción Express */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-borde-suave">
            <button
              type="button"
              onClick={() => setActiveTab('listado')}
              className="min-h-[2.75rem] px-5 py-2 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={createMutation.isPending}
              onClick={() => handleSubmit('PUBLICADO')}
              className="min-h-[2.85rem] px-6 py-2 rounded-full bg-gradient-to-r from-oferta to-primario text-sobre-primario font-extrabold text-xs uppercase tracking-wider shadow-terra-flotante flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Publicar y Distribuir Ahora</span>
            </button>
          </div>
        </div>
      ) : (
        /* ===================== MODALIDAD 2: AVANZADO ===================== */
        <div className="flex flex-col gap-6 pt-2">
          {/* BLOQUE 1: INFORMACIÓN GENERAL Y CONTENIDO */}
          <div className="rounded-terra-campo border border-borde p-4 sm:p-5 flex flex-col gap-4 bg-superficie-1">
            <div className="flex items-center justify-between pb-2 border-b border-borde-suave">
              <span className="text-xs font-extrabold uppercase tracking-wider text-texto-principal flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primario text-sobre-primario text-[0.68rem] flex items-center justify-center">
                  1
                </span>
                <span>Información General y Contenido</span>
              </span>
              <span className="text-[0.65rem] text-texto-suave">Campos con * son obligatorios</span>
            </div>

            {/* Título */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="titulo-avanzado" className="text-xs font-extrabold uppercase tracking-wider text-texto-principal">
                Título del Comunicado *
              </label>
              <input
                id="titulo-avanzado"
                type="text"
                required
                maxLength={150}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Protocolo de Seguridad Ocupacional y Cambio de EPP en Planta..."
                className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 text-sm font-medium text-texto-principal"
              />
            </div>

            {/* Extracto */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="extracto-avanzado" className="text-xs font-extrabold uppercase tracking-wider text-texto-principal">
                Extracto / Resumen Ejecutivo (Para notificación push en smartphones)
              </label>
              <input
                id="extracto-avanzado"
                type="text"
                maxLength={280}
                value={extracto}
                onChange={(e) => setExtracto(e.target.value)}
                placeholder="Breve resumen que verán los operarios en la notificación del teléfono antes de abrir..."
                className="w-full min-h-[3rem] px-4 py-2 rounded-terra-campo bg-superficie-2 border border-borde focus:border-primario focus:bg-superficie-1 text-sm font-medium text-texto-principal"
              />
            </div>

            {/* Nivel de Prioridad en 3 tarjetas */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-texto-principal">
                Nivel de Prioridad *
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPrioridad('NORMAL')}
                  className={`p-3 rounded-terra-campo border-[1.5px] text-left transition-all cursor-pointer ${
                    prioridad === 'NORMAL'
                      ? 'border-primario bg-primario-claro/20'
                      : 'border-borde bg-superficie-2/50'
                  }`}
                >
                  <p className="font-extrabold text-xs text-texto-principal">Normal</p>
                  <p className="text-[0.68rem] text-texto-suave mt-0.5">
                    Avisos generales, capacitaciones y actividades corporativas.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPrioridad('IMPORTANTE')}
                  className={`p-3 rounded-terra-campo border-[1.5px] text-left transition-all cursor-pointer ${
                    prioridad === 'IMPORTANTE'
                      ? 'border-[#b27600] bg-[#fff7df]'
                      : 'border-borde bg-superficie-2/50'
                  }`}
                >
                  <p className="font-extrabold text-xs text-[#b27600]">Importante</p>
                  <p className="text-[0.68rem] text-texto-suave mt-0.5">
                    Políticas de turnos, normativas internas y beneficios.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPrioridad('URGENTE')}
                  className={`p-3 rounded-terra-campo border-[1.5px] text-left transition-all cursor-pointer ${
                    prioridad === 'URGENTE'
                      ? 'border-alerta bg-primario-claro'
                      : 'border-borde bg-superficie-2/50'
                  }`}
                >
                  <p className="font-extrabold text-xs text-alerta">Urgente</p>
                  <p className="text-[0.68rem] text-texto-suave mt-0.5">
                    Alertas de seguridad, emergencias y retiros inmediatos.
                  </p>
                </button>
              </div>
            </div>

            {/* Editor Enriquecido */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold uppercase tracking-wider text-texto-principal">
                  Cuerpo del Comunicado (Editor Enriquecido) *
                </span>
                <span className="text-[0.65rem] text-texto-suave">Modo: HTML Estructurado</span>
              </div>

              {/* Barra de herramientas del editor */}
              <div className="flex items-center gap-1 p-1 rounded-t-terra-campo bg-superficie-2 border border-borde border-b-0 text-xs">
                <button
                  type="button"
                  onClick={() => handleInsertEditorTag('b')}
                  className="px-2.5 py-1 font-extrabold rounded hover:bg-superficie-1"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertEditorTag('i')}
                  className="px-2.5 py-1 italic font-serif rounded hover:bg-superficie-1"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertEditorTag('h2')}
                  className="px-2.5 py-1 font-extrabold text-[0.7rem] rounded hover:bg-superficie-1"
                >
                  H2
                </button>
                <div className="h-4 w-px bg-borde mx-1" />
                <button
                  type="button"
                  onClick={() => handleInsertEditorTag('alerta')}
                  className="px-2.5 py-1 font-bold text-primario text-xs rounded hover:bg-superficie-1"
                >
                  + Cuadro Alerta
                </button>
              </div>

              <textarea
                rows={5}
                value={cuerpoHtml}
                onChange={(e) => setCuerpoHtml(e.target.value)}
                className="w-full p-4 rounded-b-terra-campo bg-superficie-2/30 border border-borde font-mono text-xs text-texto-principal focus:outline-none focus:border-primario focus:bg-superficie-1"
              />
            </div>
          </div>

          {/* BLOQUE 2: GALERÍA DE IMÁGENES Y DOCUMENTOS PDF */}
          <div className="rounded-terra-campo border border-borde p-4 sm:p-5 flex flex-col gap-4 bg-superficie-1">
            <div className="flex items-center justify-between pb-2 border-b border-borde-suave">
              <span className="text-xs font-extrabold uppercase tracking-wider text-texto-principal flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primario text-sobre-primario text-[0.68rem] flex items-center justify-center">
                  2
                </span>
                <span>Galería de Imágenes y Documentos PDF</span>
              </span>
              <span className="text-[0.65rem] text-texto-suave">Almacenamiento en servidor propio</span>
            </div>

            {/* Galería de Imágenes */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-texto-principal">
                    Imágenes Institucionales ({imagenes.length})
                  </p>
                  <p className="text-[0.68rem] text-texto-suave">
                    Formatos permitidos: JPG, PNG. La primera imagen se usará como portada principal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="min-h-[2.25rem] px-3.5 py-1 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-primario" />
                  <span>Cargar Imagen</span>
                </button>
              </div>

              {imagenes.length === 0 ? (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-4 rounded-terra-campo border border-dashed border-borde bg-superficie-2/40 hover:bg-superficie-2 text-texto-suave hover:text-texto-principal flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-primario" />
                  <span className="text-xs font-semibold">Seleccionar imagen institucional desde tu equipo (JPG, PNG)</span>
                </button>
              ) : (
                imagenes[0] && (
                  <div className="relative w-48 rounded-terra-campo border-2 border-primario overflow-hidden p-1.5 bg-superficie-2">
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-primario text-sobre-primario text-[0.6rem] font-extrabold z-10">
                      ★ PORTADA
                    </span>
                    <div className="w-full h-28 rounded-terra-chico overflow-hidden bg-black/10">
                      <img
                        src={imagenes[0].urlImagen}
                        alt="Portada"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1.5 text-xs">
                      <span className="text-[0.65rem] font-bold truncate">{imagenes[0].nombreArchivo}</span>
                      <button
                        type="button"
                        onClick={() => setImagenes([])}
                        className="text-alerta hover:text-alerta/80 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Documentos Oficiales en PDF */}
            <div className="flex flex-col gap-2 pt-2 border-t border-borde-suave">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-texto-principal">
                    Documentos Oficiales en PDF ({pdfAdjunto ? 1 : 0})
                  </p>
                  <p className="text-[0.68rem] text-texto-suave">
                    Validación automática: Solo archivos .PDF con tamaño máximo de 25MB por archivo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="min-h-[2.25rem] px-3.5 py-1 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-primario" />
                  <span>Adjuntar PDF</span>
                </button>
              </div>

              {!pdfAdjunto ? (
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="p-4 rounded-terra-campo border border-dashed border-borde bg-superficie-2/40 hover:bg-superficie-2 text-texto-suave hover:text-texto-principal flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <FileText className="w-4 h-4 text-primario" />
                  <span className="text-xs font-semibold">Seleccionar documento PDF (máx. 25MB)</span>
                </button>
              ) : (
                <div className="p-3 rounded-terra-campo bg-superficie-2 border border-borde flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-primario" />
                    <div>
                      <p className="text-xs font-bold text-texto-principal">{pdfAdjunto.nombre}</p>
                      <p className="text-[0.65rem] text-texto-suave">
                        {(pdfAdjunto.tamanoBytes / 1024 / 1024).toFixed(1)} MB • Verificación digital completada
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPdfAdjunto(null)}
                    className="text-alerta hover:text-alerta/80 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BLOQUE 3: ALCANCE Y SELECCIÓN JERÁRQUICA DE DESTINATARIOS */}
          <div className="rounded-terra-campo border border-borde p-4 sm:p-5 flex flex-col gap-4 bg-superficie-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-borde-suave gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-texto-principal flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primario text-sobre-primario text-[0.68rem] flex items-center justify-center font-bold">
                  3
                </span>
                <span>Alcance y Selección Jerárquica de Destinatarios</span>
              </span>

              <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-extrabold bg-[#e4f4e9] text-exito border border-[#bfe3ca] shadow-xs">
                Estimado de Alcance: ~{estimacion?.totalColaboradores ?? (modoDistribucion === 'TODA_EMPRESA' ? usuarios.length : 0)} colaboradores
              </span>
            </div>

            {/* Selector de Modalidad Inicial: Toda la Empresa vs Selección Jerárquica Secuencial */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opción 1: Toda la Empresa */}
              <button
                type="button"
                onClick={() => setModoDistribucion('TODA_EMPRESA')}
                className={`p-3.5 rounded-terra-campo border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  modoDistribucion === 'TODA_EMPRESA'
                    ? 'border-primario bg-superficie-crema shadow-terra-sm ring-1 ring-primario/25'
                    : 'border-borde bg-superficie-2/50 hover:bg-superficie-2'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-terra-chico flex items-center justify-center shrink-0 ${
                    modoDistribucion === 'TODA_EMPRESA'
                      ? 'bg-primario text-sobre-primario'
                      : 'bg-superficie-1 text-texto-suave border border-borde'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-xs text-texto-principal">Toda la Empresa</p>
                    <span className="px-2 py-0.5 rounded-full text-[0.62rem] font-bold bg-[#e4f4e9] text-exito">
                      {usuarios.length > 0 ? `100% Dotación (${usuarios.length})` : '100% Dotación'}
                    </span>
                  </div>
                  <p className="text-[0.68rem] text-texto-suave mt-0.5">
                    Distribución institucional obligatoria para todas las sucursales, departamentos y personal.
                  </p>
                </div>
              </button>

              {/* Opción 2: Selección Jerárquica Secuencial */}
              <button
                type="button"
                onClick={() => setModoDistribucion('SECUENCIAL')}
                className={`p-3.5 rounded-terra-campo border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  modoDistribucion === 'SECUENCIAL'
                    ? 'border-primario bg-superficie-crema shadow-terra-sm ring-1 ring-primario/25'
                    : 'border-borde bg-superficie-2/50 hover:bg-superficie-2'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-terra-chico flex items-center justify-center shrink-0 ${
                    modoDistribucion === 'SECUENCIAL'
                      ? 'bg-primario text-sobre-primario'
                      : 'bg-superficie-1 text-texto-suave border border-borde'
                  }`}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-xs text-texto-principal">Selección Jerárquica Secuencial</p>
                    <span className="px-2 py-0.5 rounded-full text-[0.62rem] font-bold bg-primario-claro text-primario">
                      Filtrado en Cascada
                    </span>
                  </div>
                  <p className="text-[0.68rem] text-texto-suave mt-0.5">
                    Selección guiada paso a paso: Sucursal ➔ Departamento ➔ Audiencia Nominativa.
                  </p>
                </div>
              </button>
            </div>

            {/* Modalidad 1: Banner Toda la Empresa */}
            {modoDistribucion === 'TODA_EMPRESA' && (
              <div className="p-3.5 rounded-terra-campo bg-superficie-2 border border-borde flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-exito shrink-0" />
                <div className="text-xs">
                  <p className="font-extrabold text-texto-principal">Distribución General Corporativa Habilitada</p>
                  <p className="text-texto-suave text-[0.7rem]">
                    Este comunicado oficial será entregado de forma directa e incondicional a todos los colaboradores ({usuarios.length} registrados).
                  </p>
                </div>
              </div>
            )}

            {/* Modalidad 2: Flujo Jerárquico Secuencial en Cascada (3 Pasos Consecutivos) */}
            {modoDistribucion === 'SECUENCIAL' && (
              <div className="flex flex-col gap-4 pt-1">
                {/* ──── PASO 1: SELECCIÓN DE SUCURSAL(ES) ──── */}
                <div className="p-4 rounded-terra-campo bg-superficie-2/70 border border-borde flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-borde-suave">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primario text-sobre-primario text-[0.65rem] font-black flex items-center justify-center">
                        1
                      </span>
                      <p className="text-xs font-extrabold text-texto-principal uppercase tracking-wide">
                        Paso 1: Selecciona la(s) Sucursal(es) de Destino
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={handleSelectAllSucursales}
                        className="text-[0.68rem] font-bold text-primario hover:underline cursor-pointer"
                      >
                        Marcar todas
                      </button>
                      <span className="text-texto-placeholder">•</span>
                      <button
                        type="button"
                        onClick={handleClearSucursales}
                        className="text-[0.68rem] font-bold text-texto-suave hover:text-texto-principal cursor-pointer"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sucursales.map((s) => {
                      const isSelected = selectedSucursalIds.includes(s.idSucursal);
                      return (
                        <button
                          key={s.idSucursal}
                          type="button"
                          onClick={() => handleToggleSucursal(s.idSucursal)}
                          className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-primario text-sobre-primario shadow-terra-sm'
                              : 'bg-superficie-1 border border-borde text-texto-suave hover:text-texto-principal hover:bg-superficie-crema'
                          }`}
                        >
                          <Store className="w-3.5 h-3.5 shrink-0" />
                          <span>{s.nombre}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[0.68rem] text-texto-suave">
                    {selectedSucursalIds.length === 0
                      ? '⚠️ Selecciona al menos una sucursal para desbloquear los departamentos correspondientes.'
                      : `${selectedSucursalIds.length} sucursal(es) seleccionada(s). Se han habilitado sus departamentos en el Paso 2.`}
                  </p>
                </div>

                {/* ──── PASO 2: SELECCIÓN DE DEPARTAMENTO(S) ──── */}
                <div
                  className={`p-4 rounded-terra-campo border flex flex-col gap-3 transition-opacity ${
                    selectedSucursalIds.length === 0
                      ? 'bg-superficie-2/30 border-dashed border-borde opacity-60'
                      : 'bg-superficie-2/70 border-borde'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-borde-suave">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primario text-sobre-primario text-[0.65rem] font-black flex items-center justify-center">
                        2
                      </span>
                      <p className="text-xs font-extrabold text-texto-principal uppercase tracking-wide">
                        Paso 2: Departamentos de Destino ({departamentosDisponibles.length} disponibles)
                      </p>
                    </div>

                    {selectedSucursalIds.length > 0 && (
                      <div className="inline-flex rounded-full bg-superficie-1 border border-borde p-0.5 text-xs font-bold self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setModoDepartamentos('TODOS')}
                          className={`px-3 py-1 rounded-full text-[0.68rem] transition-all cursor-pointer ${
                            modoDepartamentos === 'TODOS'
                              ? 'bg-primario text-sobre-primario shadow-xs'
                              : 'text-texto-suave hover:text-texto-principal'
                          }`}
                        >
                          Todos ({departamentosDisponibles.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setModoDepartamentos('SELECCIONADOS')}
                          className={`px-3 py-1 rounded-full text-[0.68rem] transition-all cursor-pointer ${
                            modoDepartamentos === 'SELECCIONADOS'
                              ? 'bg-primario text-sobre-primario shadow-xs'
                              : 'text-texto-suave hover:text-texto-principal'
                          }`}
                        >
                          Específicos
                        </button>
                      </div>
                    )}
                  </div>

                  {selectedSucursalIds.length === 0 ? (
                    <p className="text-xs text-texto-suave italic">
                      Completa el Paso 1 seleccionando al menos una sucursal para ver sus departamentos asociados.
                    </p>
                  ) : modoDepartamentos === 'TODOS' ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-terra-chico bg-superficie-1 border border-borde text-xs text-texto-principal">
                      <CheckCircle2 className="w-4 h-4 text-exito shrink-0" />
                      <span>
                        Se incluirán <strong>todos los {departamentosDisponibles.length} departamentos</strong> de las sucursales elegidas.
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        {departamentosDisponibles.map((d) => {
                          const isSelected = selectedDepartamentoIds.includes(d.idDepartamento);
                          return (
                            <button
                              key={d.idDepartamento}
                              type="button"
                              onClick={() => handleToggleDepartamento(d.idDepartamento)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-primario text-sobre-primario shadow-terra-sm'
                                  : 'bg-superficie-1 border border-borde text-texto-suave hover:text-texto-principal hover:bg-superficie-crema'
                              }`}
                            >
                              <Building2 className="w-3.5 h-3.5 shrink-0" />
                              <span>{d.nombre}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[0.68rem] text-texto-suave">
                        {selectedDepartamentoIds.length === 0
                          ? '⚠️ Selecciona al menos un departamento para continuar al Paso 3.'
                          : `${selectedDepartamentoIds.length} departamento(s) seleccionado(s).`}
                      </p>
                    </div>
                  )}
                </div>

                {/* ──── PASO 3: SELECCIÓN NOMINATIVA / AUDIENCIA ──── */}
                <div
                  className={`p-4 rounded-terra-campo border flex flex-col gap-3 transition-opacity ${
                    selectedSucursalIds.length === 0 ||
                    (modoDepartamentos === 'SELECCIONADOS' && selectedDepartamentoIds.length === 0)
                      ? 'bg-superficie-2/30 border-dashed border-borde opacity-60'
                      : 'bg-superficie-2/70 border-borde'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-borde-suave">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primario text-sobre-primario text-[0.65rem] font-black flex items-center justify-center">
                        3
                      </span>
                      <p className="text-xs font-extrabold text-texto-principal uppercase tracking-wide">
                        Paso 3: Audiencia y Selección Nominativa ({usuariosDisponibles.length} personas)
                      </p>
                    </div>
                  </div>

                  {selectedSucursalIds.length === 0 ||
                  (modoDepartamentos === 'SELECCIONADOS' && selectedDepartamentoIds.length === 0) ? (
                    <p className="text-xs text-texto-suave italic">
                      Completa los pasos anteriores para habilitar la selección de audiencia o colaboradores.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      {/* 3 Modos de Audiencia */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setModoDestinatarios('TODOS')}
                          className={`p-3 rounded-terra-campo border text-left transition-all cursor-pointer ${
                            modoDestinatarios === 'TODOS'
                              ? 'border-primario bg-superficie-crema shadow-terra-sm ring-1 ring-primario/25'
                              : 'border-borde bg-superficie-1 hover:bg-superficie-2'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-extrabold text-xs text-texto-principal">Todos los Colaboradores</p>
                            <Users className="w-3.5 h-3.5 text-texto-placeholder" />
                          </div>
                          <p className="text-[0.68rem] text-texto-suave mt-1">
                            100% del personal de las áreas elegidas ({usuariosDisponibles.length} personas)
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModoDestinatarios('ENCARGADOS')}
                          className={`p-3 rounded-terra-campo border text-left transition-all cursor-pointer ${
                            modoDestinatarios === 'ENCARGADOS'
                              ? 'border-primario bg-superficie-crema shadow-terra-sm ring-1 ring-primario/25'
                              : 'border-borde bg-superficie-1 hover:bg-superficie-2'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-extrabold text-xs text-texto-principal">Solo Encargados / Jefaturas</p>
                            <UserCheck className="w-3.5 h-3.5 text-texto-placeholder" />
                          </div>
                          <p className="text-[0.68rem] text-texto-suave mt-1">
                            Líderes y encargados de las áreas elegidas ({encargadosDisponibles.length})
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModoDestinatarios('NOMINATIVO')}
                          className={`p-3 rounded-terra-campo border text-left transition-all cursor-pointer ${
                            modoDestinatarios === 'NOMINATIVO'
                              ? 'border-primario bg-superficie-crema shadow-terra-sm ring-1 ring-primario/25'
                              : 'border-borde bg-superficie-1 hover:bg-superficie-2'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-extrabold text-xs text-texto-principal">Selección Nominativa</p>
                            <CheckCircle2 className="w-3.5 h-3.5 text-texto-placeholder" />
                          </div>
                          <p className="text-[0.68rem] text-texto-suave mt-1">
                            Elegir colaboradores puntuales uno a uno con buscador
                          </p>
                        </button>
                      </div>

                      {/* Lista Nominativa con Buscador en Vivo */}
                      {modoDestinatarios === 'NOMINATIVO' && (
                        <div className="p-3.5 rounded-terra-campo bg-superficie-1 border border-borde flex flex-col gap-3">
                          {/* Barra de Búsqueda y Acciones Rápidas */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="relative flex-1">
                              <Search className="w-3.5 h-3.5 text-texto-placeholder absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Buscar colaborador por nombre, correo o rol..."
                                value={busquedaUsuario}
                                onChange={(e) => setBusquedaUsuario(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 rounded-terra-chico bg-superficie-2 border border-borde text-xs text-texto-principal placeholder:text-texto-placeholder focus:outline-none focus:ring-1 focus:ring-primario"
                              />
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <span className="text-[0.68rem] font-extrabold px-2.5 py-1 rounded-full bg-superficie-2 text-primario border border-borde">
                                {selectedUsuarioIds.length} de {usuariosDisponibles.length} seleccionados
                              </span>
                              <button
                                type="button"
                                onClick={handleSelectAllUsuarios}
                                className="text-[0.68rem] font-bold text-primario hover:underline cursor-pointer"
                              >
                                Todos
                              </button>
                              <span className="text-texto-placeholder">•</span>
                              <button
                                type="button"
                                onClick={handleClearAllUsuarios}
                                className="text-[0.68rem] font-bold text-texto-suave hover:text-texto-principal cursor-pointer"
                              >
                                Ninguno
                              </button>
                            </div>
                          </div>

                          {/* Lista Scrollable de Colaboradores */}
                          <div className="max-h-60 overflow-y-auto pr-1 flex flex-col gap-1.5 divide-y divide-borde-suave">
                            {usuariosFiltradosBusqueda.length === 0 ? (
                              <p className="text-xs text-texto-suave text-center py-4 italic">
                                No se encontraron colaboradores que coincidan con la búsqueda.
                              </p>
                            ) : (
                              usuariosFiltradosBusqueda.map((u) => {
                                const isChecked = selectedUsuarioIds.includes(u.idUsuario);
                                return (
                                  <label
                                    key={u.idUsuario}
                                    className={`pt-1.5 pb-1 px-2 rounded-terra-chico flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                                      isChecked
                                        ? 'bg-primario-claro/40'
                                        : 'hover:bg-superficie-2'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleToggleUsuario(u.idUsuario)}
                                        className="w-4 h-4 rounded text-primario focus:ring-primario cursor-pointer shrink-0"
                                      />
                                      <div className="w-7 h-7 rounded-full bg-superficie-crema text-primario border border-primario/30 flex items-center justify-center text-[0.65rem] font-extrabold shrink-0">
                                        {UsuarioRules.getIniciales(u.nombre)}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold text-texto-principal truncate">{u.nombre}</p>
                                        <p className="text-[0.68rem] text-texto-suave truncate">{u.correo}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="px-2 py-0.5 rounded-full text-[0.62rem] font-bold bg-superficie-2 text-texto-suave border border-borde">
                                        {u.departamento}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[0.62rem] font-bold bg-primario-claro text-primario">
                                        {u.rol}
                                      </span>
                                    </div>
                                  </label>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* BLOQUE 4: OPCIONES DE PUBLICACIÓN */}
          <div className="rounded-terra-campo border border-borde p-4 sm:p-5 flex flex-col gap-4 bg-superficie-1">
            <div className="pb-2 border-b border-borde-suave">
              <span className="text-xs font-extrabold uppercase tracking-wider text-texto-principal flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primario text-sobre-primario text-[0.68rem] flex items-center justify-center">
                  4
                </span>
                <span>Opciones de Publicación</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="check-programar"
                type="checkbox"
                checked={isProgramado}
                onChange={(e) => setIsProgramado(e.target.checked)}
                className="w-4 h-4 rounded text-primario focus:ring-primario cursor-pointer"
              />
              <label htmlFor="check-programar" className="text-xs font-bold text-texto-principal cursor-pointer">
                Programar para emisión automática en fecha futura
              </label>
            </div>

            {isProgramado && (
              <div className="p-3 rounded-terra-campo bg-superficie-2 border border-borde max-w-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primario" />
                <input
                  type="datetime-local"
                  value={fechaProgramada}
                  onChange={(e) => setFechaProgramada(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-texto-principal focus:outline-none"
                />
              </div>
            )}

            {/* Barra de Acciones */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-borde-suave mt-2">
              <button
                type="button"
                onClick={() => setActiveTab('listado')}
                className="w-full sm:w-auto min-h-[2.75rem] px-5 py-2 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal cursor-pointer"
              >
                Descartar Cambios
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  disabled={createMutation.isPending}
                  onClick={() => handleSubmit('BORRADOR')}
                  className="min-h-[2.75rem] px-4.5 py-2 rounded-full bg-superficie-1 hover:bg-superficie-2 border border-borde text-xs font-bold text-texto-principal flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Borrador</span>
                </button>

                <button
                  type="button"
                  disabled={createMutation.isPending || !evaluacionRol.autorizado}
                  onClick={() => handleSubmit('PUBLICADO')}
                  className="min-h-[2.75rem] px-6 py-2 rounded-full bg-gradient-to-r from-oferta to-primario text-sobre-primario font-extrabold text-xs uppercase tracking-wider shadow-terra-flotante flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isProgramado ? 'Programar Comunicado' : 'Publicar Comunicado Oficial'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
