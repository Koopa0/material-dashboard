/**
 * Database 相關資料模型
 * Notion 風格的資料庫系統
 */

import { Page, PageIcon, PageCover } from './page.model';

export interface Database {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  icon?: PageIcon;
  cover?: PageCover;

  // Schema definition
  properties: DatabaseProperty[];

  // Data rows (each row is a Page)
  rowIds: string[];

  // Views
  views: DatabaseView[];
  defaultViewId: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastEditedBy: string;
}

export interface DatabaseProperty {
  id: string;
  name: string;
  type: PropertyType;
  options?: PropertyOptions;
}

export enum PropertyType {
  TITLE = 'title',
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  DATE = 'date',
  PERSON = 'person',
  FILES = 'files',
  CHECKBOX = 'checkbox',
  URL = 'url',
  EMAIL = 'email',
  PHONE = 'phone',
  FORMULA = 'formula',
  RELATION = 'relation',
  ROLLUP = 'rollup',
  CREATED_TIME = 'created_time',
  CREATED_BY = 'created_by',
  LAST_EDITED_TIME = 'last_edited_time',
  LAST_EDITED_BY = 'last_edited_by',
}

export interface PropertyOptions {
  // For SELECT and MULTI_SELECT
  options?: SelectOption[];

  // For NUMBER
  format?: NumberFormat;

  // For FORMULA
  expression?: string;

  // For RELATION
  databaseId?: string;

  // For ROLLUP
  relationPropertyId?: string;
  rollupPropertyId?: string;
  function?: RollupFunction;
}

export interface SelectOption {
  id: string;
  name: string;
  color: SelectColor;
}

export type SelectColor =
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';

export enum NumberFormat {
  NUMBER = 'number',
  NUMBER_WITH_COMMAS = 'number_with_commas',
  PERCENT = 'percent',
  DOLLAR = 'dollar',
  EURO = 'euro',
  POUND = 'pound',
  YEN = 'yen',
  RUBLE = 'ruble',
  RUPEE = 'rupee',
}

export enum RollupFunction {
  COUNT = 'count',
  COUNT_VALUES = 'count_values',
  EMPTY = 'empty',
  NOT_EMPTY = 'not_empty',
  UNIQUE = 'unique',
  SHOW_UNIQUE = 'show_unique',
  SUM = 'sum',
  AVERAGE = 'average',
  MEDIAN = 'median',
  MIN = 'min',
  MAX = 'max',
  RANGE = 'range',
}

export interface DatabaseView {
  id: string;
  name: string;
  type: ViewType;
  filter?: ViewFilter;
  sort?: ViewSort[];
  groupBy?: string;
  properties: ViewPropertySettings;
  createdAt: Date;
  updatedAt: Date;
}

export enum ViewType {
  TABLE = 'table',
  BOARD = 'board',
  GALLERY = 'gallery',
  LIST = 'list',
  CALENDAR = 'calendar',
  TIMELINE = 'timeline',
}

export interface ViewFilter {
  and?: FilterCondition[];
  or?: FilterCondition[];
}

export interface FilterCondition {
  property: string;
  condition: FilterOperator;
  value?: any;
}

export enum FilterOperator {
  // Text
  EQUALS = 'equals',
  DOES_NOT_EQUAL = 'does_not_equal',
  CONTAINS = 'contains',
  DOES_NOT_CONTAIN = 'does_not_contain',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',

  // Number
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',

  // Date
  BEFORE = 'before',
  AFTER = 'after',
  ON_OR_BEFORE = 'on_or_before',
  ON_OR_AFTER = 'on_or_after',
  PAST_WEEK = 'past_week',
  PAST_MONTH = 'past_month',
  PAST_YEAR = 'past_year',
  NEXT_WEEK = 'next_week',
  NEXT_MONTH = 'next_month',
  NEXT_YEAR = 'next_year',

  // Checkbox
  CHECKED = 'checked',
  UNCHECKED = 'unchecked',
}

export interface ViewSort {
  property: string;
  direction: SortDirection;
}

export enum SortDirection {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export interface ViewPropertySettings {
  [propertyId: string]: {
    visible: boolean;
    width?: number;
    order?: number;
  };
}

// Database Query
export interface DatabaseQueryRequest {
  filter?: ViewFilter;
  sorts?: ViewSort[];
  pageSize?: number;
  cursor?: string;
}

export interface DatabaseQueryResponse {
  results: Page[];
  nextCursor?: string;
  hasMore: boolean;
}

// Create Database
export interface CreateDatabaseRequest {
  title: string;
  icon?: PageIcon;
  parentId?: string;
  properties: DatabaseProperty[];
}

// Create Row (Page in Database)
export interface CreateDatabaseRowRequest {
  properties: DatabaseRowProperties;
}

export interface DatabaseRowProperties {
  [propertyId: string]: PropertyValue;
}

export type PropertyValue =
  | TitlePropertyValue
  | TextPropertyValue
  | NumberPropertyValue
  | SelectPropertyValue
  | MultiSelectPropertyValue
  | DatePropertyValue
  | PersonPropertyValue
  | FilesPropertyValue
  | CheckboxPropertyValue
  | UrlPropertyValue
  | EmailPropertyValue
  | PhonePropertyValue;

export interface TitlePropertyValue {
  title: Array<{ text: { content: string } }>;
}

export interface TextPropertyValue {
  richText: Array<{ text: { content: string } }>;
}

export interface NumberPropertyValue {
  number: number;
}

export interface SelectPropertyValue {
  select: { name: string; color?: SelectColor };
}

export interface MultiSelectPropertyValue {
  multiSelect: Array<{ name: string; color?: SelectColor }>;
}

export interface DatePropertyValue {
  date: { start: string; end?: string };
}

export interface PersonPropertyValue {
  people: Array<{ id: string }>;
}

export interface FilesPropertyValue {
  files: Array<{ name: string; url: string }>;
}

export interface CheckboxPropertyValue {
  checkbox: boolean;
}

export interface UrlPropertyValue {
  url: string;
}

export interface EmailPropertyValue {
  email: string;
}

export interface PhonePropertyValue {
  phoneNumber: string;
}

// Default property configs for creating new databases
export const DEFAULT_DATABASE_PROPERTIES: DatabaseProperty[] = [
  {
    id: 'title',
    name: 'Name',
    type: PropertyType.TITLE,
  },
  {
    id: 'status',
    name: 'Status',
    type: PropertyType.SELECT,
    options: {
      options: [
        { id: 'not-started', name: 'Not Started', color: 'gray' },
        { id: 'in-progress', name: 'In Progress', color: 'blue' },
        { id: 'completed', name: 'Completed', color: 'green' },
      ],
    },
  },
  {
    id: 'tags',
    name: 'Tags',
    type: PropertyType.MULTI_SELECT,
    options: {
      options: [],
    },
  },
  {
    id: 'created',
    name: 'Created',
    type: PropertyType.CREATED_TIME,
  },
];
