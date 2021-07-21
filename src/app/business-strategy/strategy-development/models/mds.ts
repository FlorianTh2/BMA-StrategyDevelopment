const lMath = require("mathjs");

const config = {
  epsilon: 1e-3, // default: 1e-12
  matrix: "Matrix",
  number: "number",
  precision: 64,
  predictable: false,
  randomSeed: null
};

const math = lMath.create(lMath.all, config);

// Laufzeit
// 1k 4min
// 4k 15min+
// node .\index.js
// step_0: 11.421ms
// step_1: 111.067ms
// step_2: 558.417ms
// step_3: 10.240s
// step_4: 1.078ms
//
// sources:
//  https://mathepedia.de/Eigenwerte.html
//  https://mathepedia.de/Charakteristisches_Polynom.html
//  https://de.wikipedia.org/wiki/Multidimensionale_Skalierung
//  https://www.statistik-nachhilfe.de/ratgeber/statistik/induktive-statistik/statistische-modellbildung-und-weitere-methoden/multidimensionale-skalierung
//  http://www.benfrederickson.com/multidimensional-scaling/
//  https://en.wikipedia.org/wiki/List_of_numerical_analysis_topics#Eigenvalue_algorithms
//  https://de.wikipedia.org/wiki/Regel_von_Sarrus
//  https://de.wikipedia.org/wiki/Determinante#Laplacescher_Entwicklungssatz
//  https://matrixcalc.org/de/vectors.html
export class MultidimensionalScaling {
  constructor() {
    console.log("Created mds instance");
  }

  calc_mds() {
    console.log("\n\n" + "STEP 0");
    console.time("step_0");

    const dimensions = 2;
    const data = [
      [8, 2],
      [2, 4]
    ];

    // const data =  [[0,548,289,576,586], [548,0,493,195,392], [289,493,0,427,776], [576,195,427,0,577], [586, 392, 776,577,0]];

    // const data = [];
    // var counter = 1000;
    // for(let a = 0; a < counter; a++){
    //     var dataToPush = []
    //     for(let b = 0; b < counter; b++){
    //         dataToPush.push(5);
    //     }
    //     data.push(dataToPush);
    // }

    let data_true = math.matrix(data);
    console.timeEnd("step_0");

    console.log("\n\n" + "STEP 1");
    console.time("step_1");
    let A = math.multiply(-0.5, math.square(data_true));
    console.timeEnd("step_1");

    console.log("\n\n" + "STEP 2");
    console.time("step_2");
    let means_each_row = math.mean(data_true, 1);
    let means_each_column = math.mean(data_true, 0);
    let total_mean = math.mean(means_each_row);
    let B = math.matrix(A);
    for (let a = 0; a < B.size()[0]; a++) {
      for (let b = 0; b < B.size()[1]; b++) {
        let valueToSet =
          B.get([a, b]) +
          total_mean -
          means_each_row.get([a]) -
          means_each_column.get([b]);
        B.subset(math.index(a, b), valueToSet);
      }
    }
    console.timeEnd("step_2");

    console.log("\n\n" + "STEP 3");
    console.time("step_3");
    const eigen = math.eigs(B);
    // both are math.js related objects (densematrix)
    const eigenValues = eigen.values;
    const eigenVectors = eigen.vectors;
    console.timeEnd("step_3");

    console.log("\n\n" + "STEP 4");
    console.time("step_4");
    // get eigenvectors of biggest eigenvalues
    const mix = [];
    for (let a = 0; a < eigenValues.size()[0]; a++) {
      mix.push({
        eigenvalue: eigenValues.get([a]),
        eigenvector: eigenVectors._data[a]
      });
    }
    mix.sort(function (a, b) {
      return b.eigenvalue - a.eigenvalue;
    });
    const first_n = mix.slice(0, dimensions);
    const first_n_eigenvalues = [];
    const first_n_eigenvectors = [];
    for (let a = 0; a < dimensions; a++) {
      first_n_eigenvalues.push(first_n[a].eigenvalue);
      first_n_eigenvectors.push(first_n[a].eigenvector);
    }

    // now: [5,2], before [2,5] -> input got interpreted as rows (zeilenvektoren)
    // now: columns -> spaltenvektoren
    const Delta = math.transpose(math.matrix(first_n_eigenvectors));
    const returnX = Delta;
    console.timeEnd("step_4");

    // console.log(X.size());
    // console.log(X)

    // according to https://de.wikipedia.org/wiki/Multidimensionale_Skalierung
    // we dont need to matrix-multiply Delta with E to get X like shown here
    // https://www.statistik-nachhilfe.de/ratgeber/statistik/induktive-statistik/statistische-modellbildung-und-weitere-methoden/multidimensionale-skalierung
    //
    // var E = math.matrix(math.diag(first_n_eigenvalues));
    // console.log(E.size())
    // math.multiply(Delta, E)

    return returnX;
  }
}
