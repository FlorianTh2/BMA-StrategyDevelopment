import { Bundle } from "./bundle";

export class BundleMatrix {
  bundles: Bundle[];

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
