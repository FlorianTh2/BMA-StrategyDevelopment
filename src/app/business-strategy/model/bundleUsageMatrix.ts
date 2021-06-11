import { IBundleUsageMatrix } from "./IBundleUsageMatrix.interface";
import { ClusterGroup } from "./clusterGroup";

export class BundleUsageMatrix implements IBundleUsageMatrix {
  clusterGroups: ClusterGroup[];

  constructor(clusterGroups: ClusterGroup[] = []) {
    this.clusterGroups = clusterGroups;
  }
}
