import { Distance } from "./distance.interface";

export class ManhattenDistance implements Distance {
  calcDistance(vector0: number[], vector1: number[]): number {
    let total = 0;
    let diff = 0;
    for (let a = 0; a < vector0.length; a++) {
      diff = Math.abs(vector0[a] - vector1[a]);
      total += diff;
    }
    return total;
  }
}
