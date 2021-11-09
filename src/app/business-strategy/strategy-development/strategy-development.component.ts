import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import * as XLSX from "xlsx";
import { ISheetsJsonRepresentation } from "../v-1-strategy-development/model/sheetsJsonRepresentation.interface";
import { ConcistencyMatrix } from "./models/concistencyMatrix";
import { Observable, Subject } from "rxjs";
import { IBundleMatrix } from "../v-1-strategy-development/model/bundleMatrix.interface";
import { BundleMatrix } from "./models/bundleMatrix";
import { Kmeans } from "./models/kmeans";
import * as seedrandom from "seedrandom";
import { ClusterResult } from "./models/clusterResult";
import { ScatterPlotData } from "../../shared/models/scatterPlotData";
import { ClusterAlgorithmListView } from "./models/clusterAlgorithmListView";
import { ClusterMembershipMatrix } from "./models/clusterMembershipMatrix";
import { WorkBook } from "xlsx";
import { BundleUsageMatrix } from "./models/bundleUsageMatrix";
import { EuclideanDistance } from "./models/distances/euclideanDistance";
import { map } from "rxjs/operators";
import {
  ConsistencyMatrix,
  ConsistencyMatrixOfUserGQL,
  CreateConsistencyMatrixGQL,
  CreateUserMaturityModelGQL,
  Project,
  ProjectsOfUserGQL,
  User,
  UserMaturityModel,
  UserMaturityModelOfUserGQL
} from "../../graphql/generated/graphql";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthorizationService } from "../../core/services/authorization.service";
import { MatSidenav } from "@angular/material/sidenav";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { ScatterPlotMdsData } from "../../shared/models/scatterPlotMdsData";
import { MultidimensionalScaling } from "./models/mds";
import { DistanceAlgorithmListView } from "./models/distances/distanceAlgorithmListView";
import { SquaredEuclideanDistance } from "./models/distances/squaredEuclideanDistance";
import { ManhattenDistance } from "./models/distances/manhattenDistance";
import { Distance } from "./models/distances/distance.interface";
import { ChebyshevDistance } from "./models/distances/chebyshev_distance";
import { Helper } from "./models/helper";
import { IOParser } from "./models/ioParser";

@Component({
  selector: "app-strategy-development",
  templateUrl: "./strategy-development.component.html",
  styleUrls: ["./strategy-development.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StrategyDevelopmentComponent implements OnInit, OnDestroy {
  consistencyMatrix_id: string;
  consistencyMatrixStored$: Observable<ConsistencyMatrix>;
  consistencyMatrixStored: ConsistencyMatrix;

  user: User = null;

  @ViewChild("drawer") sidenav: MatSidenav;
  @ViewChild("stepper") stepper;
  showFiller = false;
  saveConsistencyMatrixFormControl = new FormControl();

  userProjects: Project[];

  workbookKonsistenzmatrix: XLSX.WorkBook;
  consistencyMatrixBlob: Blob;
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
  consistencyBoundary: number = 1;
  setNewBundleLabelPosition: boolean = true;
  clusterAlgorithms: ClusterAlgorithmListView[] = [
    {
      value: "kmeans",
      viewValue: "Kmeans-Algorithmus"
    }
  ];
  selectedClusterAlgorithm: string = this.clusterAlgorithms[0].value;
  clusterMembershipMatrix: ClusterMembershipMatrix;
  workbookClusterMembershipMatrix: WorkBook;
  bundleUsageMatrix: BundleUsageMatrix;

  mdsData: ScatterPlotMdsData[] = [
    { clusterName: "cluster 0", x: 0, y: 0 },
    { clusterName: "cluster 1", x: 1, y: 1 },
    { clusterName: "cluster 2", x: 2, y: 2 },
    { clusterName: "cluster 3", x: 3, y: 3 },
    { clusterName: "cluster 4", x: 4, y: 4 }
  ];

  saveConsistencyMatrixForm: FormGroup;
  filename: string;
  distanceMeasurements: DistanceAlgorithmListView[] = [
    {
      value: new EuclideanDistance(),
      viewValue: "Euklidische Distanz"
    },
    {
      value: new SquaredEuclideanDistance(),
      viewValue: "Quadratische Euklidische Distanz"
    },
    {
      value: new ManhattenDistance(),
      viewValue: "Manhatten Distanz"
    },
    {
      value: new ChebyshevDistance(),
      viewValue: "Chebyshev Distanz"
    }
  ];
  selectedDistanceAlgorithm: Distance = this.distanceMeasurements[0].value;

  constructor(
    private route: ActivatedRoute,
    private consistencyMatrixOfUserGQL: ConsistencyMatrixOfUserGQL,
    private authorizationService: AuthorizationService,
    private projectsOfUserGQL: ProjectsOfUserGQL,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private createConsistencyMatrixGQL: CreateConsistencyMatrixGQL,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consistencyMatrix_id = this.route.snapshot.paramMap.get(
      "consistencyMatrix_id"
    );

    this.authorizationService.userObservable.subscribe((a) => {
      this.user = a;
    });

    if (this.user) {
      this.projectsOfUserGQL
        .watch()
        .valueChanges.pipe(
          map((result) => result.data.projectsOfUser as Project[])
        )
        .subscribe(
          (res) => {
            this.userProjects = res;
          },
          (err) => {}
        );
    }

    if (this.consistencyMatrix_id) {
      this.loadConsistencyMatrixFromBackend();
    }

    this.createForm();
  }

  private createForm() {
    this.saveConsistencyMatrixForm = this.fb.group({
      consistencyMatrixNameView: new FormControl("", [Validators.required]),
      consistencyMatrixDescription: new FormControl("", [Validators.required]),
      projectsView: new FormControl("", [Validators.required])
    });
  }

  loadConsistencyMatrixFromBackend() {
    this.consistencyMatrixStored$ = this.consistencyMatrixOfUserGQL
      .watch({ consistencyMatrixId: this.consistencyMatrix_id })
      .valueChanges.pipe(
        map(
          (result) => result.data.consistencyMatrixOfUser as ConsistencyMatrix
        )
      );

    this.consistencyMatrixStored$.subscribe(
      (res) => {
        this.consistencyMatrixStored = res;

        const blob = IOParser.b64toBlob(this.consistencyMatrixStored.fileData);
        this.consistencyMatrixBlob = blob;
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

          this.consistencyMatrix =
            IOParser.parseAoAToConsistencyMatrix(resultAoA);
          this.changeDetectorRef.markForCheck();
        };
        fileReader.readAsArrayBuffer(blob);
      },
      (error) => {}
    );
  }

  saveConsistencyMatrixToggle() {
    this.sidenav.toggle();
  }

  uploadConsistencyMatrix(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    console.log("hi");
    if (fileList) {
      if (fileList.length !== 1) {
        throw new Error("Cannot use multiple files");
      }
      IOParser.readUploadedConsistencyMatrix(this, fileList.item(0));
    }
  }

  markForChangeCheck() {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  createBundles($event: MouseEvent) {
    console.time("createBundleMatrix");
    this.bundleMatrix = new BundleMatrix(
      this.consistencyMatrix,
      this.maxIterations,
      this.maxStoredBundles,
      this.consistencyBoundary,
      this.setNewBundleLabelPosition
    );
    console.timeEnd("createBundleMatrix");
    console.log(this.bundleMatrix.bundles.length);
  }

  downloadBundles($event: MouseEvent) {
    IOParser.downloadBundlesFromBundleMatrix(this.bundleMatrix);
  }

  setClusterAnalysisRunStatus(running: boolean) {
    this.clusterAnalysisRunning = running;
  }

  startClusteranalysis($event: MouseEvent) {
    // console.log(
    //   "startClusteranalysis: ",
    //   this.bundleMatrix.bundleMatrixRowColumnCombinations
    // );
    // console.log("startClusteranalysis: ", this.bundleMatrix.bundles);
    // switch between selectedClusterAlgorithms
    if (this.selectedClusterAlgorithm == "kmeans") {
      // const exampleDate: number[][] = [
      //   [0.83685684, 2.13635938],
      //   [-1.4136581, 7.40962324],
      //   [1.15521298, 5.09961887],
      //   [-1.01861632, 7.81491465],
      //   [1.27135141, 1.89254207],
      //   [3.43761754, 0.26165417],
      //   [-1.80822253, 1.59701749],
      //   [1.41372442, 4.38117707],
      //   [-0.20493217, 8.43209665],
      //   [-0.71109961, 8.66043846]
      // ];
      this.setClusterAnalysisRunStatus(true);
      const clusterResultStore: Record<number, ClusterResult> = {};
      for (
        let a = this.minConsideredClusters;
        // <= instead of < since we want to include the maxConsideredClusters-number too
        a <= this.maxConsideredClusters;
        a++
      ) {
        const kmeans = new Kmeans(a, 2, this.selectedDistanceAlgorithm);
        kmeans.find_clusters(this.bundleMatrix.bundles);
        // kmeans.find_clusters(exampleDate);
        clusterResultStore[a] = {
          labels: kmeans.labels,
          centroids: kmeans.centroids,
          inertia: kmeans.inertia,
          neededIterations: kmeans.iterations,
          numberClusters: kmeans.numClusters
        } as ClusterResult;
      }
      console.log("check: ", clusterResultStore);
      this.clusterAnalysisResults = clusterResultStore;
      this.setClusterAnalysisRunStatus(false);
      this.clusterMembershipMatrix = new ClusterMembershipMatrix(
        this.bundleMatrix,
        undefined,
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
      this.selectedNumberOfClusters = this.minConsideredClusters;
    } else {
      this.selectedNumberOfClusters = parseInt(event.target.value);
    }
    this.clusterMembershipMatrix.clusterMemberShipDict =
      this.clusterMembershipMatrix.parseClusterResultToInternalDict(
        this.clusterAnalysisResults[this.selectedNumberOfClusters]
      );

    // if we select 2 clusters that does not mean that
    // the clustermembershipmatrix has 2 entries
    // because all bundles could be assigned to cluster 1 only
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
    return Helper.getMaxNumberOfBundles(
      Helper.convertVariablesDictToList(
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

  setConsistencyBoundary(event): void {
    this.consistencyBoundary = event.target.value;
  }

  uploadClusterMembershipMatrix(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      if (fileList.length !== 1) {
        throw new Error("Cannot use multiple files");
      }
      IOParser.readUploadedClusterMembershipMatrix(this, fileList.item(0));
    }
  }

  getMaxClusterNumber() {
    return Object.keys(this.clusterAnalysisResults).length;
  }

  createBundleUsageMatrix(event: MouseEvent) {
    console.log("click create bundleUsageMatrix");
    console.log(this.clusterMembershipMatrix);
    this.bundleUsageMatrix = new BundleUsageMatrix(
      this.consistencyMatrix,
      this.bundleMatrix,
      this.clusterMembershipMatrix
    );
  }

  downloadBundleUsageMatrix(event: MouseEvent) {
    IOParser.downloadBundleUsageMatrix(this.bundleUsageMatrix);
  }

  // this.saveConsistencyMatrixForm = this.fb.group({
  //   consistencyMatrixNameView: new FormControl("", [Validators.required]),
  //   consistencyMatrixDescription: new FormControl("", [Validators.required]),
  //   projectsView: new FormControl("", [Validators.required])
  // });

  saveConsistencyMatrix() {
    console.log("filename: ", this.filename);
    const selectedProjects: Project[] =
      this.saveConsistencyMatrixForm.get("projectsView").value;
    const selectedProjectId: string = selectedProjects[0].id;
    console.log("projectid: ", selectedProjectId);

    const selectedConsistencyMatrixName = this.saveConsistencyMatrixForm.get(
      "consistencyMatrixNameView"
    ).value;
    const selectedConsistencyMatrixDescription =
      this.saveConsistencyMatrixForm.get("consistencyMatrixDescription").value;

    let createdUserMaturityModelId: string;
    var reader = new FileReader();
    reader.readAsDataURL(this.consistencyMatrixBlob);
    reader.onloadend = (e) => {
      // https://stackoverflow.com/questions/18650168/convert-blob-to-base64
      const base64dataWithDonwloadTags: string = reader.result as string;
      const base64data: string = base64dataWithDonwloadTags.substr(
        base64dataWithDonwloadTags.indexOf(",") + 1
      );
      // console.log("here again: ", selectedProjectId);
      this.createConsistencyMatrixGQL
        .mutate({
          consistencyMatrix: {
            name: selectedConsistencyMatrixName,
            filename: this.filename,
            description: selectedConsistencyMatrixDescription,
            consistencyMatrixBlobBase64String: base64data,
            projectId: selectedProjectId
          }
        })
        .pipe()
        .subscribe((a) => {
          console.log("here again: ", selectedProjectId);
          const createdConsistencyMatrixId = a.data.createConsistencyMatrix.id;
          this.router.navigate([
            "/project/" +
              selectedProjectId +
              "/projectelements/consistencyMatrix/" +
              createdConsistencyMatrixId
          ]);
        });
    };
  }

  calculateMds($event: MouseEvent) {
    console.log("this.bundleUsageMatrix", this.bundleUsageMatrix);
    // one "point" / cluster / clusterUsage == 1 row
    const data = this.bundleUsageMatrix.clusterGroups.map((a) => {
      return Object.values(a.options);
    });
    console.log("dataa: ", data);
    const labels = this.bundleUsageMatrix.clusterGroups.map((a) => {
      return a.name;
    });
    const multiDimensionalScaling = new MultidimensionalScaling();
    const distanceMatrix: number[][] =
      multiDimensionalScaling.calc_distanceMatrix(data, data, false);
    // console.log("distance matrixx: ", distanceMatrix);
    const mdsResult: number[][] =
      multiDimensionalScaling.calc_mds(distanceMatrix);
    // console.log("mds result: ", mdsResult);
    this.mdsData = mdsResult.map((a, aIndex) => {
      return {
        x: a[0],
        y: a[1],
        clusterName: "cluster " + labels[aIndex]
      } as ScatterPlotMdsData;
    });

    // const labels = ["Berlin", "Frankfurt", "Hamburg", "Köln", "München"];
    // const distances = [
    //   [0, 548, 289, 576, 586],
    //   [548, 0, 493, 195, 392],
    //   [289, 493, 0, 427, 776],
    //   [576, 195, 427, 0, 577],
    //   [586, 392, 776, 577, 0]
    // ];
    // const multiDimensionalScaling = new MultidimensionalScaling();
    // const mdsResult: number[][] = multiDimensionalScaling.calc_mds(distances);
    // this.mdsData = mdsResult.map((a, aIndex) => {
    //   return {
    //     x: a[0],
    //     y: a[1],
    //     clusterName: labels[aIndex]
    //   } as ScatterPlotMdsData;
    // });
  }

  downloadExampleConsistencyMatrix($event: MouseEvent) {}

  returnCurrentDistanceMeasure(): string {
    let result = this.distanceMeasurements.filter(
      (a) => a.value === this.selectedDistanceAlgorithm
    )[0].viewValue;
    return result;
  }

  resetProcess() {
    this.consistencyMatrix_id = undefined;
    this.consistencyMatrixStored = undefined;
    this.workbookKonsistenzmatrix = undefined;
    this.consistencyMatrixBlob = undefined;
    this.consistencyMatrix = undefined;
    this.clusterAnalysisResults = [];
    this.selectedNumberOfClusters = 1;
    this.minConsideredClusters = 1;
    this.maxConsideredClusters = 10;
    this.maxIterations = 500_000;
    this.maxStoredBundles = 4_000;
    this.consistencyBoundary = 1;
    this.setNewBundleLabelPosition = true;
    this.selectedClusterAlgorithm = this.clusterAlgorithms[0].value;
    this.clusterMembershipMatrix = undefined;
    this.workbookClusterMembershipMatrix = undefined;
    this.bundleUsageMatrix = undefined;
    this.mdsData = undefined;
    this.bundleMatrix = undefined;

    this.stepper.reset();
    this.markForChangeCheck();
  }
}
