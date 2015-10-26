import ICache from './ICache';
var LRU = require("lru-cache");

class Cache implements ICache {

  cache: any;

  constructor() {
    this.cache = LRU({max: 500});
  }

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: any) {
    this.cache.set(key, value);
  }

  dump() {
    return this.cache.dump();
  }

  load(dump: any) {
    this.cache.load(dump);
  }

}

export default Cache;
