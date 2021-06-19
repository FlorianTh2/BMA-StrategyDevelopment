import * as XLSX from "xlsx";

export interface ISheetsJsonRepresentation {
  workbook: XLSX.WorkBook;
  resultFileName: string;
  resultDataAoA: any[][];
}
