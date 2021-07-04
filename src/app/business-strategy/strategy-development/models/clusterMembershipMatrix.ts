import { BundleData } from "./bundleData";
import { BundleMatrix } from "./bundleMatrix";
import { ClusterResult } from "./clusterResult";

export class ClusterMembershipMatrix {
  // mapping clusterName -> bundleName
  clusterMemberShipDict: Record<string, string[]>;

  // each bundles has at the same index as the bundle a bundleMetaData-object
  bundles: number[][];
  bundleMetaData: BundleData[];
  bundleMatrixRowColumnCombinations: string[][];

  constructor(bundleMatrix: BundleMatrix) {
    this.bundleMatrixRowColumnCombinations =
      bundleMatrix.bundleMatrixRowColumnCombinations;
    this.bundles = bundleMatrix.bundles;
    this.bundleMetaData = bundleMatrix.bundleMetaData;
  }

  // result: clusterName/clusterNumber -> bundleName(-s)
  parseFromAoAToInternalDict(inputArray: Array<Array<any>>): void {
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
    this.clusterMemberShipDict = resultDict;
  }

  // result: clusterName/clusterNumber -> bundleName(-s)
  // takes bundleName from this.bundleMetaData
  parseClusterResultToInternalDict(clusterResult: ClusterResult) {
    console.log(clusterResult);
    let resultDict: Record<string, string[]> = {};
    clusterResult.labels.forEach((a, aIndex) => {
      resultDict[a] =
        resultDict[a] == undefined
          ? [this.bundleMetaData[aIndex].name]
          : [...resultDict[a], this.bundleMetaData[aIndex].name];
    });
    this.clusterMemberShipDict = resultDict;
  }
}
