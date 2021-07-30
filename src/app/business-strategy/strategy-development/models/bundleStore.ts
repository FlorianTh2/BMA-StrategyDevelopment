import { Bundle } from "./bundle";

export class BundleStore {
  bundleStorage: Bundle[];
  maxBundles: number;
  minConsistencyValue: number;
  _consistencyStrategySetNewBundle: boolean = true;

  constructor(maxBundles: number, consistencyStrategySetNewBundle: boolean) {
    this.bundleStorage = [];
    this.maxBundles = maxBundles;
    this.minConsistencyValue = -1;
    this._consistencyStrategySetNewBundle = consistencyStrategySetNewBundle;
  }

  addBundle(bundle: Bundle) {
    // 1. = bundle is not consistent
    // 2. if bundleStore is full and bundles consistencyValue is lower than current minConsistencyValue
    //  discard bundle
    if (bundle == null) return;
    if (this.bundleStorage.length == this.maxBundles) {
      if (
        bundle.consistence < this.minConsistencyValue ||
        (!this._consistencyStrategySetNewBundle &&
          bundle.consistence == this.minConsistencyValue)
      )
        return;
      // can just pop since we already checked if lower than lowest
      this.bundleStorage.pop();
    }
    const index = this.binarySearchDescendingInputValues(
      this.bundleStorage,
      bundle.consistence
    );
    // parameter
    // 1. at index
    // 2. deleting x items first
    // 3. element
    this.bundleStorage.splice(index, 0, bundle);
    // set new minConsistence
    this.minConsistencyValue = this.bundleStorage[0].consistence;
  }

  // https://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
  // https://stackoverflow.com/questions/22697936/binary-search-in-javascript
  // input e.g. array = [0,1,2,3], value=1
  // output e.g. 1
  binarySearchAscendingInputValues(array: Bundle[], value) {
    let low = 0;
    let high = array.length;
    let mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      if (array[mid].consistence < value) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  // input e.g. array = [8, 7, 6, 5, 4, 3, 2, 1], value=7
  // output e.g. 1
  binarySearchDescendingInputValues(array: Bundle[], value): number {
    let low = 0;
    let high = array.length;
    let mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      if (array[mid].consistence > value) low = mid + 1;
      else high = mid;
    }
    return low;
  }
}
