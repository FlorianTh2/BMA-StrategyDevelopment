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

  constructor(
    bundleMatrix: BundleMatrix,
    clusterMemberShipDictPara: Record<string, string[]> = undefined,
    clusterResult: ClusterResult = undefined
  ) {
    this.bundleMatrixRowColumnCombinations =
      bundleMatrix.bundleMatrixRowColumnCombinations;
    this.bundles = bundleMatrix.bundles;
    this.bundleMetaData = bundleMatrix.bundleMetaData;

    if (clusterMemberShipDictPara === undefined) {
      this.clusterMemberShipDict =
        this.parseClusterResultToInternalDict(clusterResult);
    } else {
      this.clusterMemberShipDict = clusterMemberShipDictPara;
    }
  }

  // result: clusterName/clusterNumber -> bundleName(-s)
  // takes bundleName from this.bundleMetaData
  parseClusterResultToInternalDict(
    clusterResult: ClusterResult
  ): Record<string, string[]> {
    console.log(clusterResult);
    let resultDict: Record<string, string[]> = {};
    clusterResult.labels.forEach((a, aIndex) => {
      resultDict[a] =
        resultDict[a] == undefined
          ? [this.bundleMetaData[aIndex].name]
          : [...resultDict[a], this.bundleMetaData[aIndex].name];
    });
    return resultDict;
  }
}
