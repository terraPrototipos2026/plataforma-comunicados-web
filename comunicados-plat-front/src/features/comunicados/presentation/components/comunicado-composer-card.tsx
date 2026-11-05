import { useState } from 'react';
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
} from 'lucide-react';
import { useCreateComunicadoMutation } from '../hooks/use-comunicado-mutations';
import { useEstimarAlcanceQuery } from '../hooks/use-comunicados-query';
import { useDepartamentosQuery } from '../../../departamentos/presentation/hooks/use-departamentos-query';
import { useSucursalesQuery } from '../../../sucursales/presentation/hooks/use-sucursales-query';
import {
  JerarquiaAlcanceRules,
} from '../../domain/models/jerarquia-alcance.rules';
import type {
  PrioridadComunicado,
  TipoAlcanceComunicado,
} from '../../domain/models/comunicado.model';
import { useComunicadosUiStore } from '../store/use-comunicados-ui-store';

export function ComunicadoComposerCard() {

  const setActiveTab = useComunicadosUiStore((state) => state.setActiveTab);
  const composerMode = useComunicadosUiStore((state) => state.composerMode);
  const setComposerMode = useComunicadosUiStore((state) => state.setComposerMode);
  const simulatedRole = useComunicadosUiStore((state) => state.simulatedRole);

  const createMutation = useCreateComunicadoMutation();
  const { data: departamentos = [] } = useDepartamentosQuery();
  const { data: sucursales = [] } = useSucursalesQuery();

  // Estados de formulario
  const [titulo, setTitulo] = useState('');
  const [extracto, setExtracto] = useState('');
  const [prioridad, setPrioridad] = useState<PrioridadComunicado>('NORMAL');
  const [cuerpoHtml, setCuerpoHtml] = useState(
    '<p>Por medio del presente comunicado oficial se informa a los colaboradores lo siguiente:</p>\n<p>Favor revisar los anexos adjuntos y confirmar la recepción de esta circular en la plataforma.</p>',
  );

  // Imágenes / Afiche
  const [imagenes, setImagenes] = useState<
    { urlImagen: string; nombreArchivo: string; tamanoBytes: number; esPortada: boolean; orden: number }[]
  >([
    {
      urlImagen: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      nombreArchivo: 'Afiche_Oficial_Grupo_Terra.jpg',
      tamanoBytes: 2400000,
      esPortada: true,
      orden: 0,
    },
  ]);

  // PDF
  const [pdfAdjunto, setPdfAdjunto] = useState<{
    url: string;
    nombre: string;
    tamanoBytes: number;
    paginas: number;
  } | null>({
    url: '/uploads/circular-oficial.pdf',
    nombre: 'Circular_Oficial_Distribucion_General.pdf',
    tamanoBytes: 1887436,
    paginas: 3,
  });

  // Alcance
  const [tipoAlcance, setTipoAlcance] = useState<TipoAlcanceComunicado>('TODA_EMPRESA');
  const [selectedSucursalIds, setSelectedSucursalIds] = useState<string[]>([]);
  const [selectedDepartamentoIds, setSelectedDepartamentoIds] = useState<string[]>([]);

  // Programación
  const [isProgramado, setIsProgramado] = useState(false);
  const [fechaProgramada, setFechaProgramada] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estimación de alcance
  const { data: estimacion } = useEstimarAlcanceQuery({
    tipoAlcance: composerMode === 'EXPRESS' ? 'TODA_EMPRESA' : tipoAlcance,
    sucursalIds: selectedSucursalIds,
    departamentoIds: selectedDepartamentoIds,
    rolSimulado: simulatedRole,
  });

  const evaluacionRol = JerarquiaAlcanceRules.evaluar(
    simulatedRole,
    composerMode === 'EXPRESS' ? 'TODA_EMPRESA' : tipoAlcance,
  );

  const handleSubmit = async (estadoFinal: 'PUBLICADO' | 'BORRADOR') => {
    setErrorMessage(null);
    if (!titulo.trim()) {
      setErrorMessage('El título del comunicado es obligatorio.');
      return;
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
        tipoAlcance: composerMode === 'EXPRESS' ? 'TODA_EMPRESA' : tipoAlcance,
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
        sucursalIds: selectedSucursalIds,
        departamentoIds: selectedDepartamentoIds,
        rolSimulado: simulatedRole,
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

              {imagenes[0] ? (
                <div className="flex flex-col gap-2">
                  <div className="w-full h-48 rounded-terra-chico overflow-hidden border border-borde bg-black/5">
                    <img
                      src={imagenes[0].urlImagen}
                      alt="Afiche"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-texto-suave truncate">{imagenes[0].nombreArchivo}</span>
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
                <div className="w-full h-48 rounded-terra-chico border-2 border-dashed border-borde flex flex-col items-center justify-center gap-2 text-texto-suave">
                  <Upload className="w-8 h-8 text-texto-placeholder" />
                  <span className="text-xs font-bold">Haz clic o arrastra un afiche institucional</span>
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

              {pdfAdjunto ? (
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
                        {(pdfAdjunto.tamanoBytes / 1024 / 1024).toFixed(1)} MB • {pdfAdjunto.paginas} páginas
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
                <div className="w-full h-48 rounded-terra-chico border-2 border-dashed border-borde flex flex-col items-center justify-center gap-2 text-texto-suave">
                  <FileText className="w-8 h-8 text-texto-placeholder" />
                  <span className="text-xs font-bold">Sin documento circular adjunto</span>
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
                  className="min-h-[2.25rem] px-3.5 py-1 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-primario" />
                  <span>Cargar Imagen</span>
                </button>
              </div>

              {imagenes[0] && (
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
                  className="min-h-[2.25rem] px-3.5 py-1 rounded-full bg-superficie-2 hover:bg-superficie-crema border border-borde text-xs font-bold text-texto-principal flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-primario" />
                  <span>Adjuntar PDF</span>
                </button>
              </div>

              {pdfAdjunto && (
                <div className="p-3 rounded-terra-campo bg-superficie-2 border border-borde flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-primario" />
                    <div>
                      <p className="text-xs font-bold text-texto-principal">{pdfAdjunto.nombre}</p>
                      <p className="text-[0.65rem] text-texto-suave">
                        {(pdfAdjunto.tamanoBytes / 1024 / 1024).toFixed(1)} MB • {pdfAdjunto.paginas} páginas • Verificación digital completada
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
            <div className="flex items-center justify-between pb-2 border-b border-borde-suave">
              <span className="text-xs font-extrabold uppercase tracking-wider text-texto-principal flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primario text-sobre-primario text-[0.68rem] flex items-center justify-center">
                  3
                </span>
                <span>Alcance y Selección Jerárquica de Destinatarios</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#e4f4e9] text-exito border border-[#bfe3ca]">
                Estimado de Alcance: ~{estimacion?.totalColaboradores ?? 191} colaboradores
              </span>
            </div>

            {/* 5 Tarjetas de Alcance */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <button
                type="button"
                onClick={() => setTipoAlcance('TODA_EMPRESA')}
                className={`p-3 rounded-terra-campo border text-left transition-all cursor-pointer ${
                  tipoAlcance === 'TODA_EMPRESA'
                    ? 'border-primario bg-superficie-crema shadow-terra-sm'
                    : 'border-borde bg-superficie-2/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-xs text-texto-principal">Toda la Empresa</p>
                  <span className="w-2 h-2 rounded-full bg-exito" />
                </div>
                <p className="text-[0.65rem] text-texto-suave mt-1">100% dotación (191)</p>
              </button>

              <button
                type="button"
                onClick={() => setTipoAlcance('POR_SUCURSAL')}
                className={`p-3 rounded-terra-campo border text-left transition-all cursor-pointer ${
                  tipoAlcance === 'POR_SUCURSAL'
                    ? 'border-primario bg-superficie-crema shadow-terra-sm'
                    : 'border-borde bg-superficie-2/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-xs text-texto-principal">Por Sucursal</p>
                  <Store className="w-3 h-3 text-texto-placeholder" />
                </div>
                <p className="text-[0.65rem] text-texto-suave mt-1">Central, Norte o Sur</p>
              </button>

              <button
                type="button"
                onClick={() => setTipoAlcance('ENCARGADOS_AREA')}
                className={`p-3 rounded-terra-campo border text-left transition-all cursor-pointer ${
                  tipoAlcance === 'ENCARGADOS_AREA'
                    ? 'border-primario bg-superficie-crema shadow-terra-sm'
                    : 'border-borde bg-superficie-2/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-xs text-texto-principal">A Encargados</p>
                  <Users className="w-3 h-3 text-texto-placeholder" />
                </div>
                <p className="text-[0.65rem] text-texto-suave mt-1">5 Jefaturas de Área</p>
              </button>

              <button
                type="button"
                onClick={() => setTipoAlcance('POR_DEPARTAMENTO')}
                className={`p-3 rounded-terra-campo border text-left transition-all cursor-pointer ${
                  tipoAlcance === 'POR_DEPARTAMENTO'
                    ? 'border-primario bg-superficie-crema shadow-terra-sm'
                    : 'border-borde bg-superficie-2/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-xs text-texto-principal">Por Departamento</p>
                  <Building2 className="w-3 h-3 text-texto-placeholder" />
                </div>
                <p className="text-[0.65rem] text-texto-suave mt-1">Cualquier departamento</p>
              </button>

              <button
                type="button"
                onClick={() => setTipoAlcance('NOMINATIVO')}
                className={`p-3 rounded-terra-campo border text-left transition-all cursor-pointer ${
                  tipoAlcance === 'NOMINATIVO'
                    ? 'border-primario bg-superficie-crema shadow-terra-sm'
                    : 'border-borde bg-superficie-2/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-xs text-texto-principal">Nominativo</p>
                  <UserCheck className="w-3 h-3 text-texto-placeholder" />
                </div>
                <p className="text-[0.65rem] text-texto-suave mt-1">Filtro puntual</p>
              </button>
            </div>

            {/* Selección condicional por Sucursal */}
            {tipoAlcance === 'POR_SUCURSAL' && (
              <div className="flex flex-col gap-1.5 p-3 rounded-terra-campo bg-superficie-2 border border-borde">
                <span className="text-[0.68rem] font-bold text-texto-suave">
                  Selecciona las Sucursales de destino:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sucursales.map((s) => {
                    const isSelected = selectedSucursalIds.includes(s.idSucursal);
                    return (
                      <button
                        key={s.idSucursal}
                        type="button"
                        onClick={() => {
                          setSelectedSucursalIds((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== s.idSucursal)
                              : [...prev, s.idSucursal]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primario text-sobre-primario shadow-sm'
                            : 'bg-superficie-1 border border-borde text-texto-suave hover:text-texto-principal'
                        }`}
                      >
                        {s.nombre}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selección condicional por Departamento */}
            {tipoAlcance === 'POR_DEPARTAMENTO' && (
              <div className="flex flex-col gap-1.5 p-3 rounded-terra-campo bg-superficie-2 border border-borde">
                <span className="text-[0.68rem] font-bold text-texto-suave">
                  Selecciona los Departamentos de destino:
                </span>
                <div className="flex flex-wrap gap-2">
                  {departamentos.map((d) => {
                    const isSelected = selectedDepartamentoIds.includes(d.idDepartamento);
                    return (
                      <button
                        key={d.idDepartamento}
                        type="button"
                        onClick={() => {
                          setSelectedDepartamentoIds((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== d.idDepartamento)
                              : [...prev, d.idDepartamento]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primario text-sobre-primario shadow-sm'
                            : 'bg-superficie-1 border border-borde text-texto-suave hover:text-texto-principal'
                        }`}
                      >
                        {d.nombre}
                      </button>
                    );
                  })}
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
