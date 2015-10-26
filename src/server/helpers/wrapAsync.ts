/// <reference path="./../server.d.ts" />

export default function wrapAsync<T extends Function>(target: Object, key: string, descriptor: TypedPropertyDescriptor<T>) {
  return {
    value: (...args: any[]): any => {
      const p: Promise<any> = descriptor.value.apply(this, args);
      if (!p || !(p instanceof Promise)) {
        throw new Error('@wrapAsync decorator must be applied to async methods only!!!')
      }
      p.catch(args[2]);
    }
  }
}
