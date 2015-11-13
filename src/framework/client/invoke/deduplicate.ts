/// <reference path="../client.d.ts" />

/**
 * Decorator for client actions (api facade). Return current not resolved promise, if
 * method already called with same parameters and promise not resolved yet. Prevent multiple api
 * requests on start.
 */
export default function deduplicate<T extends Function>(target: Object, key: string, descriptor: TypedPropertyDescriptor<T>) {
  const cache = {};

  return {
    value: function(...args: any[]): any {
      const cacheKey = `${key}_${JSON.stringify(args)}`;
      if (cacheKey in cache) {
        return cache[cacheKey];
      }

      const p: Promise<any> = descriptor.value.apply(this, args);
      if (!p || !(p instanceof Promise)) {
        throw new Error('@deduplicate decorator must be applied only to methods returned promises!!!')
      }
      const drop = () => { delete cache[cacheKey]; };
      p.then(drop, drop);
      cache[cacheKey] = p;

      return p;
    }
  }
}
