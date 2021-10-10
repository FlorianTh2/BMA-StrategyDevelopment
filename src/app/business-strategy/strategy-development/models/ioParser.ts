import { MetadataVariable, MetadataVariableOption } from "./metadataVariable";
import { ConcistencyMatrix } from "./concistencyMatrix";
import * as XLSX from "xlsx";
import { StrategyDevelopmentComponent } from "../strategy-development.component";
import { BundleMatrix } from "./bundleMatrix";
import { ClusterMembershipMatrix } from "./clusterMembershipMatrix";
import { BundleUsageMatrix } from "./bundleUsageMatrix";

export abstract class IOParser {
  public static parseAoAToConsistencyMatrix(
    dataInputWithHeader: Array<Array<any>>
  ): ConcistencyMatrix {
    console.log("parse");
    let numberOptions = dataInputWithHeader[0].slice(3).length;
    let resultArray: number[][] = [];
    let metadataByVariable: Record<string, MetadataVariable> = {};
    let dataInput: any[][] = dataInputWithHeader.slice(1);
    dataInput.forEach((row: any[], rowIndex: number) => {
      if (metadataByVariable[row[0].trim()]) {
        metadataByVariable[row[0].trim()].options[row[2].trim()] = {
          id: row[2].trim(),
          name: row[1].trim(),
          index: rowIndex
        } as MetadataVariableOption;
        metadataByVariable[row[0].trim()].numberOptions += 1;
      } else {
        metadataByVariable[row[0].trim()] = {
          id: row[0].trim(),
          startIndex: rowIndex,
          numberOptions: 1,
          options: {
            [row[2].trim()]: {
              id: row[2].trim(),
              name: row[1].trim(),
              index: rowIndex
            }
          } as Record<string, MetadataVariableOption>
        };
      }
      let rowOptions = row.slice(3);
      let resultRowArray = Array.from(Array(numberOptions));
      rowOptions.forEach((b, indexB) => {
        resultRowArray[indexB] = typeof b === "number" ? b : undefined;
      });
      resultArray.push(resultRowArray);
    });

    console.log("finished parsingAoAToConsistencyMatrix");
    return new ConcistencyMatrix(resultArray, metadataByVariable);
  }

  public static readUploadedConsistencyMatrix(
    strategyDevelopmentComponent: StrategyDevelopmentComponent,
    file: File
  ) {
    strategyDevelopmentComponent.filename = file.name;
    strategyDevelopmentComponent.consistencyMatrixBlob = file;

    // https://stackoverflow.com/questions/28782074/excel-to-json-javascript-code
    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      var fileReaderResult = e.target.result as ArrayBufferLike;
      // new array to handle xls AND xlsx AND csv
      var fileReaderResultCasted = new Uint8Array(fileReaderResult);
      strategyDevelopmentComponent.workbookKonsistenzmatrix = XLSX.read(
        fileReaderResultCasted,
        {
          type: "array"
        }
      );

      // only first sheet for now
      var resultAoA: Array<Array<any>> = XLSX.utils.sheet_to_json(
        strategyDevelopmentComponent.workbookKonsistenzmatrix.Sheets[
          strategyDevelopmentComponent.workbookKonsistenzmatrix.SheetNames[0]
        ],
        {
          header: 1
        }
      );

      strategyDevelopmentComponent.consistencyMatrix =
        IOParser.parseAoAToConsistencyMatrix(resultAoA);
      console.log(strategyDevelopmentComponent.consistencyMatrix);
      strategyDevelopmentComponent.markForChangeCheck();
    };
    fileReader.readAsArrayBuffer(file);
  }

  public static downloadBundlesFromBundleMatrix(bundleMatrix: BundleMatrix) {
    console.time("createaoa");
    // 1. bundleMatrix to aoa
    let resultArray: Array<Array<any>> = [];
    // first row
    resultArray.push(
      ["Options-Kombinationen"].concat(
        bundleMatrix.bundleMetaData.map((a) => {
          return a.bundleSzenarioCombinationString;
        })
      )
    );
    // second row
    resultArray.push(
      ["Paare"].concat(
        bundleMatrix.bundleMetaData.map((a) => {
          return a.name;
        })
      )
    );

    // third row
    resultArray.push(
      ["Konsistenzwert"].concat(
        bundleMatrix.bundleMetaData.map((a) => {
          return a.consistence.toString();
        })
      )
    );

    for (
      let a = 0;
      a < bundleMatrix.bundleMatrixRowColumnCombinations.length;
      a++
    ) {
      const row = [];
      row.push(bundleMatrix.bundleMatrixRowColumnCombinations[a].join("/"));
      bundleMatrix.bundles.forEach((b) => {
        row.push(b[a]);
      });
      resultArray.push(row);
    }
    console.timeEnd("createaoa");
    // 2. aoa to sheet
    var fileName = "strategiebuendel";
    var workSheet = XLSX.utils.aoa_to_sheet(resultArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

  public static readUploadedClusterMembershipMatrix(
    strategyDevelopmentComponent: StrategyDevelopmentComponent,
    file: File
  ) {
    // https://stackoverflow.com/questions/28782074/excel-to-json-javascript-code
    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      var fileReaderResult = e.target.result as ArrayBufferLike;
      // new array to handle xls AND xlsx AND csv
      var fileReaderResultCasted = new Uint8Array(fileReaderResult);
      strategyDevelopmentComponent.workbookClusterMembershipMatrix = XLSX.read(
        fileReaderResultCasted,
        {
          type: "array"
        }
      );

      // only first sheet for now
      var resultAoA: Array<Array<any>> = XLSX.utils.sheet_to_json(
        strategyDevelopmentComponent.workbookClusterMembershipMatrix.Sheets[
          strategyDevelopmentComponent.workbookClusterMembershipMatrix
            .SheetNames[0]
        ],
        {
          header: 1
        }
      );

      strategyDevelopmentComponent.clusterMembershipMatrix =
        new ClusterMembershipMatrix(
          strategyDevelopmentComponent.bundleMatrix,
          IOParser.parseFromAoAToInternalDictClusterMembershipMatrix(resultAoA)
        );
    };
    fileReader.readAsArrayBuffer(file);
  }

  // result: clusterName/clusterNumber -> bundleName(-s)
  public static parseFromAoAToInternalDictClusterMembershipMatrix(
    inputArray: Array<Array<any>>
  ): Record<string, string[]> {
    console.log("hi");
    console.log(inputArray);
    let resultDict: Record<string, string[]> = {};
    // cut header row
    inputArray = inputArray.slice(1);
    inputArray.forEach((a) => {
      const clusterName = a[1].toString().trim();
      const bundleName = a[0].trim();
      resultDict[clusterName] =
        resultDict[clusterName] == undefined
          ? [bundleName]
          : [...resultDict[clusterName], bundleName];
    });
    console.log(resultDict);
    return resultDict;
  }

  public static downloadBundleUsageMatrix(
    bundleUsageMatrix: BundleUsageMatrix
  ) {
    console.log("Ausprägungsmatrix herunterladen");
    let resultAoA: Array<Array<string>> = [];
    resultAoA.push(
      ["Variable", "Option"].concat(
        bundleUsageMatrix.clusterGroups.map((a) => "Cluster " + a.name)
      )
    );
    bundleUsageMatrix.metadataBundleUsageVariables.forEach((a) => {
      a.options.forEach((b) => {
        let valueList = bundleUsageMatrix.clusterGroups.map((c) => {
          return c.options[b.id].toFixed(2);
        });
        resultAoA.push([a.id, b.id, ...valueList]);
      });
    });

    var fileName = "auspraegungsmatrix";
    // if we use workbook and NOT the resulting array it must be:
    // .json_to_sheet or something like that
    var workSheet = XLSX.utils.aoa_to_sheet(resultAoA);
    // format to output numbers instead of string-type
    IOParser.formatWorksheetToNumbers(workSheet, 2, resultAoA);

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

  public static formatWorksheetToNumbers(
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
      IOParser.formatColumn(worksheet, col, format);
    }
  }

  public static formatColumn(worksheet, col, fmt) {
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

  public static b64toBlob(b64Data, contentType = "", sliceSize = 512): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
