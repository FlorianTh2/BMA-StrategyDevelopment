import { IBundleMatrix } from "./bundleMatrix.interface";
import { Bundle } from "./bundle";

export class BundleMatrix implements IBundleMatrix {
  bundles: Bundle[];

  constructor(bundles: Bundle[] = []) {
    this.bundles = bundles;
  }

  // Bundle is unconsistent, if only one element/index in bundle is 1
  // (smallest semantic number in bundle)
  // 0 is no semantic number, its just a placeholder
  reduceToConsistentBundles(): BundleMatrix {
    return new BundleMatrix(
      this.bundles
        .map((a: Bundle) => {
          let atLeastOneElementOne: boolean = false;
          Object.entries(a.bundleData).forEach(([key, value]) => {
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
