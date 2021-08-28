import { Distance } from "./distance.interface";

export class SquaredEuclideanDistance implements Distance {
  calcDistance(vector0: number[], vector1: number[]): number {
    let total = 0;
    let diff = 0;
    for (let a = 0; a < vector0.length; a++) {
      diff = vector1[a] - vector0[a];
      total += diff * diff;
    }
    return total;
  }
}
