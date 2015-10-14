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
//  transaction(options: any): Promise<IDBTransaction>;
//  end(): void;
}

export default IDB;
