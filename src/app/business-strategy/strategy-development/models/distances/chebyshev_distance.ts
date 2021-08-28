import { Distance } from "./distance.interface";

export class ChebyshevDistance implements Distance {
  calcDistance(vector0: number[], vector1: number[]): number {
    let currentMaxResult = Math.abs(vector1[0] - vector0[0]);
    for (let a = 1; a < vector0.length; a++) {
      const tmpResult = Math.abs(vector1[a] - vector0[a]);
      if (currentMaxResult < tmpResult) {
        currentMaxResult = tmpResult;
      }
    }
    return currentMaxResult;
  }
}
