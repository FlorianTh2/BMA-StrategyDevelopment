import { Bundle } from "./bundle";

export class BundleMatrix {
  bundles: Bundle[];
  // stores all possible bundleMatrixRowColumnCombinations
  // needed since the bundles only store metadata about at which index they got a value (in a sparse manner)
  // e.g. ["2A", "3A"]
  //  and not their values embedded in a full size "all rows" vector
  // e.g. [["1A","2A"],["1A","2B"]]
  // inner array stores exactly 2 elements: 1. row 2. column
  bundleMatrixRowColumnCombinations: string[][];

  constructor(bundles: Bundle[] = []) {
    this.bundles = bundles;
  }

  // reduceToConsistentBundles(): BundleMatrix {
  //   return new BundleMatrix(
  //     this.bundles
  //       .map((a: Bundle) => {
  //         let atLeastOneElementOne: boolean = false;
  //         Object.entries(a.bundleData).forEach(([key, value]) => {
  //           if (value === 1) atLeastOneElementOne = true;
  //         });
  //         if (atLeastOneElementOne) {
  //           return null;
  //         }
  //         return a;
  //       })
  //       .filter((b) => b !== null)
  //   );
  // }
}
