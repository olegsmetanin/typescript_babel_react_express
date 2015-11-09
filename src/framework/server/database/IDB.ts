export interface IDBClient {
  query(...args: any[]): Promise<any>;
  release(): void;
}

export interface IDBTransaction {
  query(...args: any[]): Promise<any>;
  commit(): void;
  rollback(): void;
}

interface IDB {
//connect(config: IDB_ConnectionConfig): Promise<IDBClient>;
  query(...args: any[]): Promise<any>;
  end(): void;
  trx(options?: any): Promise<IDBTransaction>;
}

export default IDB;
