import { Component, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
import { Sheet2JSONOpts } from "xlsx";
import { ConcistencyMatrix } from "../model/consistencyMatrix";

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
  consistencyMatrix: ConcistencyMatrix;

  constructor() {}

  ngOnInit(): void {}

  fileChanged(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      if (fileList.length !== 1) throw new Error("Cannot use multiple files");
      this.file = fileList.item(0);
      this.uploadDocumentSheetToJson();
    }
  }

  // https://stackoverflow.com/questions/28782074/excel-to-json-javascript-code
  uploadDocumentSheetToJson() {
    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      var fileReaderResult = e.target.result as ArrayBufferLike;
      // new array to handle xls AND xlsx AND csv
      var fileReaderResultCasted = new Uint8Array(fileReaderResult);
      var workbook = XLSX.read(fileReaderResultCasted, { type: "array" });
      this.workbookKonsistenzmatrix = workbook;
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

      // taken only first sheet for now
      this.resultFileName = resultKeys[0];
      this.resultArray = firstSheetArray;
      this.consistencyMatrix = new ConcistencyMatrix(
        this.resultFileName,
        this.resultArray
      );
      let createbundles: Array<Record<string, number>> = this.consistencyMatrix.createbundles();
      this.exportBundlesToSheet(createbundles);
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  exportBundlesToSheet(bundles: Array<Record<string, number>>){
    let resultArray = this.exportBundlesConvertToAoA(bundles);
    console.log("result array string")
    console.log(resultArray);
    this.exportBundlesDownloadToUser(resultArray);
  }

  exportBundlesConvertToAoA(bundles: Array<Record<string, number>>){
    let resultArray: Array<Array<string>> = [];
    resultArray.push(["Paare"].concat(
      bundles.map((a, index) => {
        return "B" + index;
      })
    ));
    let bundleKeys = Object.keys(bundles[0]);
    console.log(bundleKeys)
    resultArray = resultArray.concat(
      bundleKeys.map((b, index) => {
        let row = []
        row.push(bundleKeys[index])
        bundles.forEach(c => {
          row.push(c[bundleKeys[index]])
        })
        return row;
      })
    )
    return resultArray;
  }

  exportBundlesDownloadToUser(bundles: Array<Array<string>>){
    var fileName = this.resultFileName;
    // if we use workbook and NOT the resulting array it must be:
    // .json_to_sheet or something like that
    var workSheet = XLSX.utils.aoa_to_sheet(bundles);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    XLSX.writeFile(wb, "strategiebündel.xlsx");
  }


  downloadDocument(event: Event){
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
}
