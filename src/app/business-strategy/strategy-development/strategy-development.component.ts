import { Component, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
import { Sheet2JSONOpts } from "xlsx";
import { ConcistencyMatrix } from "../model/consistencyMatrix";
import { IBundleMatrix } from "../model/bundleMatrix.interface";
import { BundleMatrix } from "../model/bundleMatrix";
import { ISheetsJsonRepresentation } from "../model/sheetsJsonRepresentation.interface";
import { ClusterMembershipMatrix } from "../model/clusterMembershipMatrix";
import { BundleUsageMatrix } from "../model/bundleUsageMatrix";

@Component({
  selector: "app-strategy-development",
  templateUrl: "./strategy-development.component.html",
  styleUrls: ["./strategy-development.component.scss"]
})
export class StrategyDevelopmentComponent implements OnInit {
  file: File = null;
  fileString: string;
  arrayBuffer: ArrayBuffer;
  // result: Record<string, Array<Array<any>>>;
  resultFileName: string;
  resultArray: Array<Array<any>>;
  workbookKonsistenzmatrix: XLSX.WorkBook;
  // consistencyMatrix -> bundleMatrix -> clusterMembershipMatrix -> bundleUsageMatrix
  consistencyMatrix: ConcistencyMatrix;
  bundleMatrix: BundleMatrix;
  clusterMembershipMatrix: ClusterMembershipMatrix;
  bundleUsageMatrix: BundleUsageMatrix;

  constructor() {}

  ngOnInit(): void {}

  fileChanged(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      if (fileList.length !== 1) throw new Error("Cannot use multiple files");
      this.file = fileList.item(0);
      this.uploadConsistencyMatrixSheetToJson();
    }
  }

  // https://stackoverflow.com/questions/28782074/excel-to-json-javascript-code
  uploadConsistencyMatrixSheetToJson(): void {
    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      var fileReaderResult = e.target.result as ArrayBufferLike;
      // new array to handle xls AND xlsx AND csv
      var fileReaderResultCasted = new Uint8Array(fileReaderResult);
      var workbook = XLSX.read(fileReaderResultCasted, { type: "array" });
      var result = {};
      workbook.SheetNames.forEach(function (sheetName) {
        var sheet: Array<Array<any>> = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName],
          {
            header: 1
          }
        );
        result[sheetName] = sheet;
      });
      let resultKeys = Object.keys(result) as string[];
      let firstSheetArray = result[resultKeys[0]];

      let returnResult = {
        // taken only first sheet for now
        resultFileName: resultKeys[0],
        workbook: workbook,
        resultDataAoA: firstSheetArray
      } as ISheetsJsonRepresentation;

      this.resultFileName = returnResult.resultFileName;
      this.resultArray = returnResult.resultDataAoA;
      this.workbookKonsistenzmatrix = returnResult.workbook;

      this.consistencyMatrix = new ConcistencyMatrix(
        this.resultFileName,
        this.resultArray
      );

      this.bundleMatrix = this.consistencyMatrix.createbundles();
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  exportBundlesToSheet(bundles: BundleMatrix) {
    let resultArray: string[][] = this.exportBundlesConvertToAoA(bundles);
    console.log("result array string");
    this.exportBundlesDownloadToUser(resultArray);
  }

  exportBundlesConvertToAoA(bundles: IBundleMatrix) {
    let resultArray: Array<Array<string>> = [];
    resultArray.push(
      ["Paare"].concat(
        bundles.bundles.map((a, index) => {
          let headerCellString = "B" + (index + 1);
          // console.log(headerCellString);
          return headerCellString;
        })
      )
    );
    let bundleKeys = Object.keys(bundles.bundles[0]);
    console.log(bundleKeys);
    resultArray = resultArray.concat(
      bundleKeys.map((b, index) => {
        let row = [];
        row.push(bundleKeys[index]);
        bundles.bundles.forEach((c) => {
          row.push(c[bundleKeys[index]]);
        });
        return row;
      })
    );
    return resultArray;
  }

  exportBundlesDownloadToUser(bundles: Array<Array<string>>) {
    var fileName = this.resultFileName;
    // if we use workbook and NOT the resulting array it must be:
    // .json_to_sheet or something like that
    var workSheet = XLSX.utils.aoa_to_sheet(bundles);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    XLSX.writeFile(wb, "strategiebündel.xlsx");
  }

  downloadDocument(event: Event) {
    this.exportBundlesToSheet(this.bundleMatrix);
  }

  exportDocumentJsonToSheet() {
    var fileName = this.resultFileName;
    // if we use workbook and NOT the resulting array it must be:
    // .json_to_sheet or something like that
    var workSheet = XLSX.utils.aoa_to_sheet(this.resultArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    XLSX.writeFile(wb, "strategiebündel.xlsx");
  }

  uploadClusterMembershipMatrix(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      if (fileList.length !== 1) throw new Error("Cannot use multiple files");
      this.file = fileList.item(0);
      this.uploadClusterMembershipMatrixSheetToJson();
    }
  }

  uploadClusterMembershipMatrixSheetToJson(): void {
    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      var fileReaderResult = e.target.result as ArrayBufferLike;
      // new array to handle xls AND xlsx AND csv
      var fileReaderResultCasted = new Uint8Array(fileReaderResult);
      var workbook = XLSX.read(fileReaderResultCasted, { type: "array" });
      var result = {};
      workbook.SheetNames.forEach(function (sheetName) {
        var sheet: Array<Array<any>> = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName],
          {
            header: 1
          }
        );
        result[sheetName] = sheet;
      });
      let resultKeys = Object.keys(result) as string[];
      let firstSheetArray = result[resultKeys[0]];

      let returnResult = {
        // taken only first sheet for now
        resultFileName: resultKeys[0],
        workbook: workbook,
        resultDataAoA: firstSheetArray
      } as ISheetsJsonRepresentation;

      this.clusterMembershipMatrix = new ClusterMembershipMatrix(
        returnResult.resultFileName,
        returnResult.resultDataAoA
      );

      this.bundleUsageMatrix = this.generateBundleUsageMatrix(
        this.consistencyMatrix,
        this.bundleMatrix,
        this.clusterMembershipMatrix
      );

      console.log("result bundleUsageMatrix:");
      console.log(this.bundleUsageMatrix);
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  generateBundleUsageMatrix(
    consistencyMatrix: ConcistencyMatrix,
    bundleMatrix: BundleMatrix,
    clusterMemberShipMatrix: ClusterMembershipMatrix
  ): BundleUsageMatrix {
    console.log("generate bundle usageMatrix");
    return null;
  }
}
