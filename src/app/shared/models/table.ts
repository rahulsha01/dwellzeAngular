export class Table {
  columns: Array<Column>;
}

export class Column {
  displayValue: string;
  sortValue: string;
  width: number;
  search: boolean;
  dataFormat?: string;
  align?: string;
}
