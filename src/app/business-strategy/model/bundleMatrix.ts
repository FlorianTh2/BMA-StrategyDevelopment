import { IBundleMatrix } from "./bundleMatrix.interface";
import { ClusterMembershipMatrix } from "./clusterMembershipMatrix";
import { BundleUsageMatrix } from "./bundleUsageMatrix";

export class BundleMatrix implements IBundleMatrix {
  bundles: Array<Record<string, number>>;

  constructor(bundles: Array<Record<string, number>> = []) {
    this.bundles = bundles;
  }
}
