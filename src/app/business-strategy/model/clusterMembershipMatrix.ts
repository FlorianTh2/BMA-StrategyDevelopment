import { IClusterMembershipMatrix } from "./IClusterMembershipMatrix.interface";

export class ClusterMembershipMatrix implements IClusterMembershipMatrix {
  name: string;
  // mapping=bundleName->clustername
  clusterMemberShipDict: Record<string, string>;

  constructor(name, data: Array<Array<any>>) {
    this.name = name;
    this.clusterMemberShipDict = this.parseToInternalDict(data);
    console.log(this.clusterMemberShipDict);
  }

  // result: bundleName -> clusterNumber (not clusterNumber -> bundleName)
  parseToInternalDict(inputArray: Array<Array<any>>): Record<string, string> {
    // console.log(inputArray);
    let resultDict: Record<string, string> = {};
    // cut header row
    inputArray = inputArray.slice(1);
    inputArray.forEach((a) => {
      resultDict[a[0].trim()] = a[1].toString().trim();
    });
    return resultDict;
  }

  // input=keys which should be in output
  // output: clustername -> [Array of bundlenames]
  createClusterToBundleMappingWithSelectedKey(
    selectedKeys: string[]
  ): Record<string, Array<string>> {
    var ret: Record<string, Array<string>> = {};
    for (var key in this.clusterMemberShipDict) {
      if (selectedKeys.includes(key)) {
        ret[this.clusterMemberShipDict[key]] =
          ret[this.clusterMemberShipDict[key]] === undefined
            ? [key]
            : [...ret[this.clusterMemberShipDict[key]], key];
      } else {
        continue;
      }
    }
    return ret;
  }
}
