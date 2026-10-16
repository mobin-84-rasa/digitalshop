'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE } from '@/lib/motion';

/**
 * App Router route transition. `template.tsx` re-mounts on navigation, so this
 * runs its enter animation for every route change.
 *
 * Only opacity is animated. Animating transform/translate here would make the
 * wrapper a containing block for `position: fixed` descendants and break the
 * gallery zoom viewer, mobile menu and search palette — so the "slide" is
 * deliberately dropped in favour of a safe cross-fade.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: EASE.standard }}
    >
      {children}
    </motion.div>
  );
}
