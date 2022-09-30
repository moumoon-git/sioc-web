/**
 * yield bem style className
 *
 * @param suffix append `__suffix`
 * @param modifier append `--${modifier}`
 * @returns bem className
 */
 const createBEM = (base: string) => (suffix?: string | string[], modifier?: string): string => {
  let res = base;
  if (Array.isArray(suffix)) {
    suffix.forEach((s) => {
      res += `__${s}`;
    });
  } else if (suffix) {
    res += `__${suffix}`;
  }
  if (modifier) {
    res += `--${modifier}`;
  }
  return res;
};

export default createBEM;
