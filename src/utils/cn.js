import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names conditionally and merges conflicting Tailwind classes.
 *
 * Uses `clsx` for conditional class evaluation and `tailwind-merge` to
 * intelligently resolve Tailwind CSS class conflicts (e.g. `p-2` vs `p-4`).
 *
 * @param {...import('clsx').ClassValue} inputs - Class names, objects, or arrays.
 * @returns {string} Merged and de-duplicated class string.
 *
 * @example
 * cn('px-2 py-1', 'px-4')           // => 'py-1 px-4'
 * cn('text-red-500', isError && 'text-red-700')  // conditional
 * cn({ 'font-bold': isBold, 'underline': isUnder })
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
