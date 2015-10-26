interface ICache {
  get(key: string): any;
  set(key: string, value: any);
  dump(): any;
  load(dump: any);
}

export default ICache;
