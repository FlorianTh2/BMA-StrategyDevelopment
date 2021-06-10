import { IBundleMatrix } from "./bundleMatrix.interface";

export class BundleMatrix implements IBundleMatrix {
  // they do not map except they share the same index for same szenarioCombination
  // ONLY THE INDEX
  bundleSzenarioStrings: string[];
  bundles: Array<Record<string, number>>;

  constructor(
    bundleSzenarioStrings: string[] = [],
    bundles: Array<Record<string, number>> = []
  ) {
    this.bundleSzenarioStrings = bundleSzenarioStrings;
    this.bundles = bundles;
  }

  // Bundle is unconsistent, if only one element/index in bundle is 1
  // (smallest semantic number in bundle)
  // 0 is no semantic number, its just a placeholder
  reduceToConsistentBundles(): BundleMatrix {
    let indexStoreForSelectingSzenarioStrings: number[] = [];
    let newElements = this.bundles
      .map((a, index) => {
        let atLeastOneElementOne: boolean = false;
        Object.entries(a).forEach(([key, value]) => {
          if (value === 1) atLeastOneElementOne = true;
        });
        if (atLeastOneElementOne) {
          indexStoreForSelectingSzenarioStrings.push(index);
          return null;
        }
        return a;
      })
      .filter((b) => b !== null);

    let newSzenarioNameList: string[] = indexStoreForSelectingSzenarioStrings.map(
      (a) => {
        return this.bundleSzenarioStrings[a];
      }
    );

    return new BundleMatrix(newSzenarioNameList, newElements);
  }
}
