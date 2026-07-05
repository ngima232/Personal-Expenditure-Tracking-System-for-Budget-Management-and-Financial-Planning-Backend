import { SortEnum } from '../enums';

export interface PaginationExtend {
  offset?: number;
  limit: number;
  page: number;
}

export interface OrderExtend {
  sort: SortEnum;
  order: string;
}

export interface SearchExtend {
  query?: string;
}

export interface PaginationOrderSearchExtend extends PaginationExtend, OrderExtend, SearchExtend { }

export interface PaginationMetadata {
  previousPage: number | any;
  currentPage: number | any;
  nextPage: number | any;
  perPage: number | any;
}
