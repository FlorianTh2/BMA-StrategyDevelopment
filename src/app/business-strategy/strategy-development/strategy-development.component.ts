import { Component, OnDestroy, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
import { ISheetsJsonRepresentation } from "../v-1-strategy-development/model/sheetsJsonRepresentation.interface";
import { ConcistencyMatrix } from "./models/ConcistencyMatrix";

@Component({
  selector: "app-strategy-development",
  templateUrl: "./strategy-development.component.html",
  styleUrls: ["./strategy-development.component.scss"]
})
export class StrategyDevelopmentComponent implements OnInit, OnDestroy {
  workbookKonsistenzmatrix: XLSX.WorkBook;
  consistencyMatrix: ConcistencyMatrix;
  bundleMatrix: {};

  constructor() {}

  ngOnInit(): void {}

  uploadConsistencyMatrix(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      if (fileList.length !== 1) {
        throw new Error("Cannot use multiple files");
      }
      let file: File = fileList.item(0);
      // https://stackoverflow.com/questions/28782074/excel-to-json-javascript-code
      let fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        var fileReaderResult = e.target.result as ArrayBufferLike;
        // new array to handle xls AND xlsx AND csv
        var fileReaderResultCasted = new Uint8Array(fileReaderResult);
        this.workbookKonsistenzmatrix = XLSX.read(fileReaderResultCasted, {
          type: "array"
        });

        // only first sheet for now
        var resultAoA: Array<Array<any>> = XLSX.utils.sheet_to_json(
          this.workbookKonsistenzmatrix.Sheets[
            this.workbookKonsistenzmatrix.SheetNames[0]
          ],
          {
            header: 1
          }
        );

        this.consistencyMatrix = new ConcistencyMatrix(resultAoA);
        this.bundleMatrix = this.consistencyMatrix.createbundles();
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  ngOnDestroy(): void {}
}
