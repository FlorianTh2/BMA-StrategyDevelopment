import { IClusterMembershipMatrix } from "./IClusterMembershipMatrix.interface";

export class ClusterMembershipMatrix implements IClusterMembershipMatrix {
  name: string;
  clusterMemberShipDict: Record<string, number>;

  constructor(name, data: Array<Array<any>>) {
    this.name = name;
    this.clusterMemberShipDict = this.parseToInternalDict(data);
    console.log(this.clusterMemberShipDict);
  }

  parseToInternalDict(inputArray: Array<Array<any>>): Record<string, number> {
    console.log(inputArray);
    let resultDict: Record<string, number> = {};
    // cut header row
    inputArray = inputArray.slice(1);
    inputArray.forEach((a) => {
      resultDict[a[0].trim()] = a[1];
    });
    return resultDict;
  }
}
