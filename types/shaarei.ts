/** Shared API-facing types for Shaarei Revacha dashboard */

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface LoginSuccessResponse {
  token: string;
}

export interface LoginErrorResponse {
  error: string;
}

/** External login payload */
export interface ExternalLoginBody {
  username: string;
  password: string;
  rememberMe: boolean;
  deviceType: string;
  deviceVersion: string;
}

export interface Branch {
  id?: string;
  _id?: string;
  branchId?: string;
  name?: string;
  title?: string;
  code?: string;
  [key: string]: unknown;
}

export interface Station {
  id?: string;
  _id?: string;
  stationId?: string;
  name?: string;
  title?: string;
  [key: string]: unknown;
}

export type TransactionState =
  | "completed"
  | "error"
  | "canceled"
  | "payment"
  | "started"
  | "created"
  | string;

export interface Transaction {
  id?: string;
  _id?: string;
  transactionId?: string;
  cardNumber?: string;
  card?: string;
  pan?: string;
  maskedCard?: string;
  amount?: number;
  total?: number;
  value?: number;
  state?: TransactionState;
  status?: TransactionState;
  createdAt?: string;
  date?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface TransactionsSearchResponse {
  transactions: Transaction[];
}
