import { Component, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
import { ConcistencyMatrix } from "./model/consistencyMatrix";
import { IBundleMatrix } from "./model/bundleMatrix.interface";
import { BundleMatrix } from "./model/bundleMatrix";
import { ISheetsJsonRepresentation } from "./model/sheetsJsonRepresentation.interface";
import { ClusterMembershipMatrix } from "./model/clusterMembershipMatrix";
import { BundleUsageMatrix } from "./model/bundleUsageMatrix";
import { ClusterGroup } from "./model/clusterGroup";

@Component({
  selector: "v-1-app-strategy-development",
  templateUrl: "./strategy-development.component.html",
  styleUrls: ["./strategy-development.component.scss"]
})
export class V1StrategyDevelopmentComponent implements OnInit {
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

  exportBundlesToSheet(bundles: BundleMatrix, szenarioStrings: string[] = []) {
    let resultArray: string[][] = this.exportBundlesConvertToAoA(bundles);
    console.log("result array string");
    this.exportBundlesDownloadToUser(resultArray);
  }

  exportBundlesConvertToAoA(bundles: IBundleMatrix) {
    let resultArray: Array<Array<string>> = [];
    // first row
    resultArray.push(
      ["Options-Kombinationen"].concat(
        bundles.bundles.map((a) => {
          return a.bundleSzenarioCombinationString;
        })
      )
    );
    // second row
    resultArray.push(
      ["Paare"].concat(
        bundles.bundles.map((a) => {
          return a.name;
        })
      )
    );
    let bundleKeys = Object.keys(bundles.bundles[0].bundleData);
    resultArray = resultArray.concat(
      bundleKeys.map((b, index) => {
        let row = [];
        row.push(bundleKeys[index]);
        bundles.bundles.forEach((c) => {
          row.push(c.bundleData[bundleKeys[index]]);
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

  downloadBundles(event: Event) {
    this.exportBundlesToSheet(this.bundleMatrix);
  }

  downloadOnlyConsistentBundles(event: Event) {
    let consistentBundleReturn = this.bundleMatrix.reduceToConsistentBundles();
    this.exportBundlesToSheet(consistentBundleReturn);
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
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  generateBundleUsageMatrix(
    consistencyMatrix: ConcistencyMatrix,
    bundleMatrix: BundleMatrix,
    clusterMemberShipMatrix: ClusterMembershipMatrix
  ): BundleUsageMatrix {
    // consider only those bundles from bundleMatrix whos name appear in clusterMemberShipMatrix
    let selectedBundleMatrix: BundleMatrix = new BundleMatrix(
      bundleMatrix.bundles
        .map((a) => {
          if (a.name in clusterMemberShipMatrix.clusterMemberShipDict) {
            return a;
          }
          return null;
        })
        .filter((a) => a !== null)
    );

    let clusterNameToBundleNameMapping = clusterMemberShipMatrix.createClusterToBundleMappingWithSelectedKey(
      selectedBundleMatrix.bundles.map((a) => {
        return a.name;
      })
    );

    let result = new BundleUsageMatrix(
      Object.entries(clusterNameToBundleNameMapping).map(([key, value]) => {
        let clusterGroup = new ClusterGroup();
        clusterGroup.name = key;
        clusterGroup.bundles = value.map((a) => {
          // has to exist, thats why we can directly [0]
          return selectedBundleMatrix.bundles.filter((b) => {
            return b.name === a;
          })[0];
        });
        // get a random options dict (random since all optionsDict should have same structure)
        let optionsDict = {};
        Object.keys(clusterGroup.bundles[0].bundleData).forEach((b) => {
          let splitOptionsCombination = b.split("/");
          splitOptionsCombination.forEach((c) => {
            optionsDict[c] = 0;
          });
        });
        clusterGroup.options = optionsDict;
        // set all values to 0
        Object.entries(clusterGroup.options).forEach(
          ([optionsKey, optionsValue]) => {
            clusterGroup.options[key] = 0;
          }
        );

        // build dict: variablenname -> optionsName -> counterOfItsAppearences
        // group under variablename is needed since later we want to aggregate
        // all optionCounts UNDER 1 VARIABLE
        let internalCounterDict: Record<string, Record<string, number>> = {};
        // if not even 1 bundle exists, idk throw error
        let pairNamesOfBundle: string[] = Object.keys(clusterGroup.bundles[0]);
        let pairNamesOfBundleDivided: string[][] = pairNamesOfBundle.map(
          (a) => {
            return a.split("/");
          }
        );
        let keysWhichAreNotZero = clusterGroup.bundles
          .map((a) => {
            return Object.entries(a.bundleData)
              .filter(([keyBundle, valueBundle]) => {
                return valueBundle != 0;
              })
              .map((a) => {
                // after this line, we will ignore the value stored after the key
                // let separatKeysToSingleOptions: string[] = keysWhichAreNotZero
                // return [a[0].split("/"), a[1]];
                return a[0].split("/");
              })
              .reduce((a, b) => a.concat(b), []);
          })
          .reduce((a, b) => a.concat(b), []);

        // find options corresponding variable name and count up (+1) in internal dict
        // here only one module is considered
        let moduleNameConsistencyMatrix = Object.keys(
          consistencyMatrix.modules
        )[0];
        // name shortening
        let mcm = moduleNameConsistencyMatrix;
        keysWhichAreNotZero.forEach((a) => {
          Object.entries(consistencyMatrix.modules[mcm]).forEach(
            ([keyVariable, valueVariable]) => {
              if (valueVariable[a] != undefined) {
                if (internalCounterDict[keyVariable] == undefined) {
                  internalCounterDict[keyVariable] = {
                    [a]: 1
                  };
                } else if (internalCounterDict[keyVariable][a] == undefined) {
                  internalCounterDict[keyVariable][a] = 1;
                } else {
                  internalCounterDict[keyVariable][a] =
                    internalCounterDict[keyVariable][a] + 1;
                }
              }
            }
          );
        });
        console.log("internal");
        // console.log(internalCounterDict);
        Object.entries(internalCounterDict).forEach(
          ([
            keyOfVariableInternalCounterDict,
            valueOfVariableInternalCounterDict
          ]) => {
            let sumOfAllOptionsOfThisVariable = Object.entries(
              valueOfVariableInternalCounterDict
            ).reduce((a, [keyOfReduce, valueOfReduce]) => a + valueOfReduce, 0);
            Object.entries(valueOfVariableInternalCounterDict).forEach(
              ([optionsKey, optionsValue]) => {
                clusterGroup.options[optionsKey] =
                  (optionsValue / sumOfAllOptionsOfThisVariable) * 100;
              }
            );
          }
        );
        // console.log("clustergroup options");
        // console.log(clusterGroup.options);
        return clusterGroup;
      })
    );
    return result;
  }

  downloadBundleUsageMatrix($event: Event) {
    console.log("download");
    let resultArray: any[][] = this.exportBundleUsageMatrixConvertToAoA(
      this.consistencyMatrix,
      this.bundleUsageMatrix
    );
    console.log("result array string");
    this.exportBundleUsageMatrixDownloadToUser(resultArray);
  }

  exportBundleUsageMatrixDownloadToUser(
    bundleUsageMatrix: Array<Array<string>>
  ) {
    var fileName = "ausprägungsmatrix";
    // if we use workbook and NOT the resulting array it must be:
    // .json_to_sheet or something like that
    var workSheet = XLSX.utils.aoa_to_sheet(bundleUsageMatrix);
    // format to output numbers instead of string-type
    this.formatWorksheetToNumbers(workSheet, 3, bundleUsageMatrix);

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

  private exportBundleUsageMatrixConvertToAoA(
    consistencyMatrix: ConcistencyMatrix,
    bundleUsageMatrix: BundleUsageMatrix
  ): string[][] {
    let resultArray: Array<Array<string>> = [];
    resultArray.push(
      ["Modul", "Variable", "Option"].concat(
        bundleUsageMatrix.clusterGroups.map((a) => "Cluster " + a.name)
      )
    );
    // for now no more than one module
    let consistencyMatrixModuleName = Object.keys(consistencyMatrix.modules)[0];
    Object.keys(consistencyMatrix.modules[consistencyMatrixModuleName]).forEach(
      (a) => {
        Object.keys(
          consistencyMatrix.modules[consistencyMatrixModuleName][a]
        ).forEach((b) => {
          let valueList = bundleUsageMatrix.clusterGroups.map((c) => {
            return c.options[b].toFixed(2);
          });
          resultArray.push([consistencyMatrixModuleName, a, b, ...valueList]);
        });
      }
    );

    return resultArray;
  }

  // https://stackoverflow.com/questions/48535736/sheetjs-how-to-format-column
  // https://github.com/SheetJS/sheetjs/issues/675
  // https://github.com/SheetJS/sheetjs/issues/1166
  // https://jsfiddle.net/1ny97xrb/1/
  // https://github.com/SheetJS/sheetjs/issues/966
  private formatWorksheetToNumbers(
    worksheet,
    startColumn: number,
    matrix: string[][]
  ) {
    const format = "0.00";
    let endColumn = startColumn + matrix[0].length;
    let arrayWithColumns = Array.from(
      { length: endColumn - startColumn },
      (v, k) => k + startColumn
    );
    for (let col of arrayWithColumns) {
      this.formatColumn(worksheet, col, format);
    }
  }

  private formatColumn(worksheet, col, fmt) {
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    // note: range.s.r + 1 skips the header row
    for (let row = range.s.r + 1; row <= range.e.r; ++row) {
      const ref = XLSX.utils.encode_cell({ r: row, c: col });
      if (worksheet[ref]) {
        worksheet[ref].t = "n";
        worksheet[ref].z = fmt;
      }
    }
  }
}
