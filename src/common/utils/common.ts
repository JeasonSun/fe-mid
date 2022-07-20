/**
 * 判断指定的参数，是否是null或者undefined
 * @param param
 * @returns
 */
export function isNull(param: unknown): boolean {
  return param === undefined || param === null;
}

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (_, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
