import { ClusterGroup } from "./clusterGroup";

export interface IBundleUsageMatrix {
  // Array
  //  clusterGroups:
  //    name
  //    options:
  //      name:
  //      usagePercent
  //    bundles: Bundles[]
  clusterGroups: ClusterGroup[];
}
