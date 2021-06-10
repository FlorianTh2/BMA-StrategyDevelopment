import { IBundleMatrix } from "./bundleMatrix.interface";
import { ClusterMembershipMatrix } from "./clusterMembershipMatrix";
import { BundleUsageMatrix } from "./bundleUsageMatrix";

export class BundleMatrix implements IBundleMatrix {
  bundles: Array<Record<string, number>>;

  constructor(bundles: Array<Record<string, number>> = []) {
    this.bundles = bundles;
  }

  // Bundle is unconsistent, if only one element/index in bundle is 1
  // (smallest semantic number in bundle)
  // 0 is no semantic number, its just a placeholder
  reduceToConsistentBundles(): BundleMatrix {
    return new BundleMatrix(
      this.bundles
        .map((a) => {
          let atLeastOneElementOne: boolean = false;
          Object.entries(a).forEach(([key, value]) => {
            console.log(key);
            if (value === 1) atLeastOneElementOne = true;
          });
          if (atLeastOneElementOne) {
            return null;
          }
          return a;
        })
        .filter((b) => b !== null)
    );
  }
}
