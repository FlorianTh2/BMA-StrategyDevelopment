import { BundleData } from "./bundleData";

export class BundleMatrix {
  // each bundles has at the same index as the bundle a bundleMetaData-object
  bundles: number[][];
  bundleMetaData: BundleData[];
  // stores all possible bundleMatrixRowColumnCombinations
  // needed since the bundles only store metadata about at which index they got a value (in a sparse manner)
  // e.g. ["2A", "3A"]
  //  and not their values embedded in a full size "all rows" vector
  // e.g. [["1A","2A"],["1A","2B"]]
  // inner array stores exactly 2 elements: 1. row 2. column
  bundleMatrixRowColumnCombinations: string[][];
}
