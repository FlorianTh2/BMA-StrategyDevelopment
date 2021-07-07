import { Bundle } from "./bundle";

export class ClusterGroup {
  name: string;
  options: Record<string, number>;
  bundles: Bundle[];
}
