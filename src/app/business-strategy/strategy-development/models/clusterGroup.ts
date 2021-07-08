import { BundleBUM } from "./bundleBUM";

// pay attention: 2 different formats here:
// 1.
export class ClusterGroup {
  name: string;
  // bundles from bundleMatrix with labels: bundleMatrixRowColumnCombinations
  bundles: BundleBUM[];
  bundleMatrixRowColumnCombinations: string[][];
  // options which stores the aggregated values under the option name of the consistency-matrix
  options: Record<string, number>;
}
