import { Component, OnDestroy, OnInit } from "@angular/core";
import * as XLSX from "xlsx";
import { ISheetsJsonRepresentation } from "../v-1-strategy-development/model/sheetsJsonRepresentation.interface";
import { ConcistencyMatrix } from "./models/concistencyMatrix";
import { Subject } from "rxjs";
import { IBundleMatrix } from "../v-1-strategy-development/model/bundleMatrix.interface";
import { BundleMatrix } from "./models/bundleMatrix";
import { Kmeans } from "./models/kmeans";
import * as seedrandom from "seedrandom";
import { ClusterResult } from "./models/clusterResult";
import { ScatterPlotData } from "../../shared/models/scatterPlotData";
import { ClusterAlgorithm } from "./models/clusterAlgorithm";
import { ClusterMembershipMatrix } from "./models/clusterMembershipMatrix";
import { WorkBook } from "xlsx";
import { BundleUsageMatrix } from "./models/bundleUsageMatrix";

// zumachen
// - wenn man custom hochlädt wird trotzdem angezeigt, dass 500.000 iterationen gemacht wurden
// -
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
  clusterAnalysisRunning: boolean = false;
  clusterAnalysisResults: Record<number, ClusterResult> = [];
  selectedNumberOfClusters: number = 1;
  maxConsideredClusters: number = 10;
  minConsideredClusters: number = 1;
  maxIterations: number = 500_000;
  maxStoredBundles: number = 4_000;
  clusterAlgorithms: ClusterAlgorithm[] = [
    {
      value: "kmeans",
      viewValue: "Kmeans-Algorithmus"
    }
  ];
  selectedClusterAlgorithm: string = this.clusterAlgorithms[0].value;
  clusterMembershipMatrix: ClusterMembershipMatrix;
  workbookClusterMembershipMatrix: WorkBook;
  bundleUsageMatrix: BundleUsageMatrix;

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
    this.consistencyMatrix._maxIterations = this.maxIterations;
    this.consistencyMatrix._maxBundles = this.maxStoredBundles;
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

  setClusterAnalysisRunStatus(running: boolean) {
    this.clusterAnalysisRunning = running;
  }

  startClusteranalysis($event: MouseEvent) {
    // switch between selectedClusterAlgorithms
    if (this.selectedClusterAlgorithm == "kmeans") {
      const exampleDate: number[][] = [
        [0.83685684, 2.13635938],
        [-1.4136581, 7.40962324],
        [1.15521298, 5.09961887],
        [-1.01861632, 7.81491465],
        [1.27135141, 1.89254207],
        [3.43761754, 0.26165417],
        [-1.80822253, 1.59701749],
        [1.41372442, 4.38117707],
        [-0.20493217, 8.43209665],
        [-0.71109961, 8.66043846]
      ];
      this.setClusterAnalysisRunStatus(true);
      for (
        let a = this.minConsideredClusters;
        a < this.maxConsideredClusters;
        a++
      ) {
        const kmeans = new Kmeans(a, 2);
        kmeans.find_clusters(this.bundleMatrix.bundles);
        // kmeans.find_clusters(exampleDate);
        this.clusterAnalysisResults[a] = {
          labels: kmeans.labels,
          centroids: kmeans.centroids,
          inertia: kmeans.inertia,
          neededIterations: kmeans.iterations,
          numberClusters: kmeans.numClusters
        } as ClusterResult;
      }
      this.setClusterAnalysisRunStatus(false);
      this.clusterMembershipMatrix = new ClusterMembershipMatrix(
        this.bundleMatrix
      );
      this.clusterMembershipMatrix.parseClusterResultToInternalDict(
        this.clusterAnalysisResults[this.selectedNumberOfClusters]
      );
    }
  }

  dictIsEmpty(dict: Record<any, any>) {
    return Object.keys(dict).length == 0;
  }

  getScatterPlotInput(
    clusterAnalysisResults: Record<number, ClusterResult>
  ): ScatterPlotData[] {
    return Object.values(clusterAnalysisResults).map((a) => {
      return {
        indexName: a.numberClusters.toString(),
        indexData: a.inertia
      } as ScatterPlotData;
    });
  }

  setSelectedNumberOfClusters(event) {
    if (event.target.value > this.maxConsideredClusters) {
      this.selectedNumberOfClusters = this.maxConsideredClusters;
    } else if (event.target.value < this.minConsideredClusters) {
      console.log("hi");
      this.selectedNumberOfClusters = this.minConsideredClusters;
    } else {
      this.selectedNumberOfClusters = parseInt(event.target.value);
    }
    this.clusterMembershipMatrix.parseClusterResultToInternalDict(
      this.clusterAnalysisResults[this.selectedNumberOfClusters]
    );
    console.log(this.clusterMembershipMatrix);
    console.log(this.selectedNumberOfClusters);
  }

  setMinConsideredClusters(event) {
    this.minConsideredClusters = event.target.value;
  }

  setMaxConsideredClusters(event) {
    this.maxConsideredClusters = event.target.value;
  }

  getNumberOfVariablesConsistencyMatrix(): number {
    return this.consistencyMatrix.getNumberOfVariables();
  }

  getNumberOfOptionsConsistencyMatrix(): number {
    return this.consistencyMatrix.getNumberOfOptions();
  }

  getMaxIterations(): number {
    return this.consistencyMatrix.getMaxNumberOfBundles(
      this.consistencyMatrix.convertVariablesDictToList(
        this.consistencyMatrix.metadataByVariable
      )
    );
  }

  setMaxIterations(event): void {
    this.maxIterations = event.target.value;
  }

  setMaxStoredBundles(event): void {
    this.maxStoredBundles = event.target.value;
  }

  uploadClusterMembershipMatrix(event: Event) {
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
        this.workbookClusterMembershipMatrix = XLSX.read(
          fileReaderResultCasted,
          {
            type: "array"
          }
        );

        // only first sheet for now
        var resultAoA: Array<Array<any>> = XLSX.utils.sheet_to_json(
          this.workbookClusterMembershipMatrix.Sheets[
            this.workbookClusterMembershipMatrix.SheetNames[0]
          ],
          {
            header: 1
          }
        );

        this.clusterMembershipMatrix = new ClusterMembershipMatrix(
          this.bundleMatrix
        );
        this.clusterMembershipMatrix.parseFromAoAToInternalDict(resultAoA);
      };
      fileReader.readAsArrayBuffer(file);
    }
  }

  getMaxClusterNumber() {
    return Object.keys(this.clusterAnalysisResults).length;
  }

  createBundleUsageMatrix(event: MouseEvent) {
    console.log("click create bundleUsageMatrix");
    this.bundleUsageMatrix = new BundleUsageMatrix(
      this.consistencyMatrix,
      this.bundleMatrix,
      this.clusterMembershipMatrix
    );
  }

  downloadBundleUsageMatrix(event: MouseEvent) {
    console.log("Ausprägungsmatrix herunterladen");
    let resultAoA: Array<Array<string>> = [];
    resultAoA.push(
      ["Variable", "Option"].concat(
        this.bundleUsageMatrix.clusterGroups.map((a) => "Cluster " + a.name)
      )
    );
    this.bundleUsageMatrix.metadataBundleUsageVariables.forEach((a) => {
      a.options.forEach((b) => {
        let valueList = this.bundleUsageMatrix.clusterGroups.map((c) => {
          return c.options[b.id].toFixed(2);
        });
        resultAoA.push([a.id, b.id, ...valueList]);
      });
    });

    var fileName = "ausprägungsmatrix";
    // if we use workbook and NOT the resulting array it must be:
    // .json_to_sheet or something like that
    var workSheet = XLSX.utils.aoa_to_sheet(resultAoA);
    // format to output numbers instead of string-type
    this.formatWorksheetToNumbers(workSheet, 2, resultAoA);

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, fileName);
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

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
