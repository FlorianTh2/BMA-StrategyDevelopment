import { Bundle } from "./bundle";

export class Cluster {
  // Array
  //  cluster:
  //    name
  //    options:
  //      name:
  //      usagePercent
  //    bundles: Bundles[]
  name: string;
  options: Record<string, number>;
  bundles: Bundle[];
}
