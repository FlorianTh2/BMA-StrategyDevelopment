import { Component, OnDestroy, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
import { ISheetsJsonRepresentation } from "../v-1-strategy-development/model/sheetsJsonRepresentation.interface";
import { ConcistencyMatrix } from "./models/concistencyMatrix";
import { Subject } from "rxjs";
import { IBundleMatrix } from "../v-1-strategy-development/model/bundleMatrix.interface";
import { BundleMatrix } from "./models/bundleMatrix";

@Component({
  selector: "app-strategy-development",
  templateUrl: "./strategy-development.component.html",
  styleUrls: ["./strategy-development.component.scss"]
})
export class StrategyDevelopmentComponent implements OnInit, OnDestroy {
  workbookKonsistenzmatrix: XLSX.WorkBook;
  consistencyMatrix: ConcistencyMatrix;
  bundleMatrix: BundleMatrix;
  destroy$: Subject<boolean> = new Subject<boolean>();

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
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  createBundles($event: MouseEvent) {
    console.time("createBundleMatrix");
    this.bundleMatrix = this.consistencyMatrix.createBundleMatrix(
      this.consistencyMatrix.array,
      this.consistencyMatrix.metadataByVariable
    );
    console.timeEnd("createBundleMatrix");
    console.log(this.bundleMatrix.bundles.length);
  }

  downloadBundles($event: MouseEvent) {
    console.time("createaoa");
    // 1. bundleMatrix to aoa
    let resultArray: Array<Array<any>> = [];
    // first row
    resultArray.push(
      ["Options-Kombinationen"].concat(
        this.bundleMatrix.bundleMetaData.map((a) => {
          return a.bundleSzenarioCombinationString;
        })
      )
    );
    // second row
    resultArray.push(
      ["Paare"].concat(
        this.bundleMatrix.bundleMetaData.map((a) => {
          return a.name;
        })
      )
    );

    for (
      let a = 0;
      a < this.bundleMatrix.bundleMatrixRowColumnCombinations.length;
      a++
    ) {
      const row = [];
      row.push(
        this.bundleMatrix.bundleMatrixRowColumnCombinations[a].join("/")
      );
      this.bundleMatrix.bundles.forEach((b) => {
        row.push(b[a]);
      });
      resultArray.push(row);
    }
    console.timeEnd("createaoa");
    // 2. aoa to sheet
    var fileName = "strategiebündel";
    var workSheet = XLSX.utils.aoa_to_sheet(resultArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    XLSX.writeFile(wb, fileName + ".xlsx");
  }
}
