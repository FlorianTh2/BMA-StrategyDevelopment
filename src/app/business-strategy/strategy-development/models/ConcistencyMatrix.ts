import { BundleMatrix } from "./BundleMatrix";

export class ConcistencyMatrix {
  data = {};

  constructor(data: Array<Array<any>>) {
    console.log("constructor");
    console.log(data);
    this.data = this.parseAoAToConsistencyMatrix(data);
  }

  parseAoAToConsistencyMatrix(data: Array<Array<any>>) {
    return null;
  }

  createbundles(): BundleMatrix {
    console.log("create bundles");
    return null;
  }
}
