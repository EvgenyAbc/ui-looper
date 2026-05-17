/**
 * `cn` — lightweight classnames utility.
 *
 * Filters falsy values, joins with space.
 * Mirrors the API of `clsx` without the dependency.
 *
 * @example
 * cn('btn', true && 'active', false && 'hidden') // → 'btn active'
 */
export type ClassValue = string | number | false | null | undefined | 0 | '';

export function cn(...args: ClassValue[]): string {
  let result = '';
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg) {
      result += (result ? ' ' : '') + arg;
    }
  }
  return result;
}
