/**
 * Common method (reduce code dulication)
 */
export interface IQueryable {
  query(...args: any[]): Promise<any>;
}

/**
 * Channel to database for running queries
 */
export interface IDBClient extends IQueryable {
  /**
   * Release db connection to the pool
   */
  release(): void;
}

/**
 * Channel to database, bounded to active transaction.
 * After calling commit or rollback, connection will be released and
 * next query attempts will throw error.
 */
export interface IDBTransaction extends IQueryable {
  /**
   * Commit transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback transaction
   */
  rollback(): Promise<void>;
}

/**
 * Manages connection pool, start transaction, helper method for single query
 */
interface IDB extends IQueryable {
  /**
   * Obtain db connection from pool and return db client on this connection
   */
  connect(): Promise<IDBClient>;

  /**
   * Close connection pool
   */
  end(): void;

  /**
   * Obtain db connection from pool, start transaction on it and return transaction
   * @param options not used now, but later may contain transaction level or something else
   */
  begin(options?: any): Promise<IDBTransaction>;
}

export default IDB;
