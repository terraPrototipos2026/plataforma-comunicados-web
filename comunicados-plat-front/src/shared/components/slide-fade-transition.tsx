import { type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from 'framer-motion';

export type TransitionDirection = 'horizontal' | 'vertical';
export type TransitionExitMode = 'through' | 'reverse';
export type TransitionPreset = 'smooth' | 'spring';
export type TransitionTrigger = 'mount' | 'scroll';

export interface SlideFadeTransitionProps {
  children: ReactNode;
  /** Modo de activación: 'mount' (al montar/cambiar estado) o 'scroll' (al entrar en viewport al hacer scroll) */
  trigger?: TransitionTrigger;
  /** Controla si el elemento está montado o se desmonta con animación de salida (modo 'mount') */
  isVisible?: boolean;
  /** Ejecuta la animación de entrada también en el primer montaje (default: true) */
  animateOnMount?: boolean;
  /** En modo 'scroll', define si la animación ocurre una sola vez (true) o cada vez que entra/sale del viewport (false) */
  once?: boolean;
  /** Porcentaje del elemento visible (0 a 1) requerido para disparar la animación en scroll (default: 0.18) */
  viewportAmount?: number;
  /** Margen del IntersectionObserver para anticipar o retrasar el disparo en scroll */
  viewportMargin?: string;
  /** Eje del movimiento: 'horizontal' (x) o 'vertical' (y) */
  direction?: TransitionDirection;
  /**
   * Comportamiento de salida:
   * - 'through': continúa de derecha a izquierda (x: 40 -> 0 -> -40)
   * - 'reverse': regresa hacia el origen (x: 40 -> 0 -> 40)
   */
  exitMode?: TransitionExitMode;
  /** Distancia en píxeles del desplazamiento inicial/final (default: 40) */
  offset?: number;
  /** Curva preconfigurada: 'smooth' (easeInOut ~280ms) o 'spring' (stiffness 300, damping 25) */
  preset?: TransitionPreset;
  /** Duración en segundos para el modo 'smooth' (default: 0.28 = 280ms) */
  duration?: number;
  /** Retraso opcional en segundos antes de iniciar la entrada (default: 0) */
  delay?: number;
  /** Key única cuando se alternan múltiples vistas dentro del mismo contenedor */
  transitionKey?: string | number;
  /** Modo de AnimatePresence */
  presenceMode?: 'wait' | 'sync' | 'popLayout';
  className?: string;
}

export function SlideFadeTransition({
  children,
  trigger = 'mount',
  isVisible = true,
  animateOnMount = true,
  once = false,
  viewportAmount = 0.18,
  viewportMargin = '0px 0px -32px 0px',
  direction = 'horizontal',
  exitMode = 'through',
  offset = 40,
  preset = 'smooth',
  duration = 0.28,
  delay = 0,
  transitionKey = 'slide-fade-content',
  presenceMode = 'wait',
  className,
}: SlideFadeTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  const axis = direction === 'horizontal' ? 'x' : 'y';
  const enterDelta = prefersReducedMotion ? 0 : offset;
  const exitDelta = prefersReducedMotion
    ? 0
    : exitMode === 'through'
      ? -offset
      : offset;

  const variants: Variants = {
    initial: {
      opacity: 0,
      [axis]: enterDelta,
    },
    animate: {
      opacity: 1,
      [axis]: 0,
    },
    exit: {
      opacity: 0,
      [axis]: exitDelta,
    },
  };

  const transitionConfig: Transition =
    preset === 'spring'
      ? { type: 'spring', stiffness: 300, damping: 25, delay }
      : { duration, ease: 'easeInOut', delay };

  if (trigger === 'scroll') {
    if (!isVisible) return null;

    return (
      <motion.div
        key={transitionKey}
        variants={variants}
        initial="initial"
        whileInView="animate"
        viewport={{
          once,
          amount: viewportAmount,
          margin: viewportMargin,
        }}
        transition={transitionConfig}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode={presenceMode} initial={animateOnMount}>
      {isVisible && (
        <motion.div
          key={transitionKey}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transitionConfig}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
