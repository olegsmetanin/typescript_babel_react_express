export interface IHTTPRequest {
  method: string;
  url: string;
  data: any;
  headers: any;
}

interface IHTTPClient {
  send(request: IHTTPRequest): Promise<any>;
}

export default IHTTPClient;
