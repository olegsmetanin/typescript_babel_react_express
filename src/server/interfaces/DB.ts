export interface IDB {
  connect(options: any): Promise<IDBClient>;
  query(...args: any[]): Promise<any>;
  transaction(options: any): Promise<IDBTransacton>;
  end(): void;
}

export interface IDBClient {
  query(...args: any[]): Promise<any>;
  reliase(): void;
}
