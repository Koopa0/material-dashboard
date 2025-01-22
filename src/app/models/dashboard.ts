import { Type } from '@angular/core';

export interface Widget {
  id: number;
  name: string;
  content: Type<unknown>;
  rows?: number;
  columns?: number;
  backgroundColor?: string;
  color?: string;
}
