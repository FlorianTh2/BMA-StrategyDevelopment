import {
  PartialModel,
  UserMaturityModel,
  UserPartialModel
} from "../../graphql/generated/graphql";

export interface InputSubUserPartialModelSpiderChart {
  maturityLevelEvaluationMetrics: number;
  maxMaturityLevelEvaluationMetrics: number;
  partialModel: PartialModel;
}

export interface InputUserPartialModelSpiderChart {
  maturityLevelEvaluationMetrics: number;
  maxMaturityLevelEvaluationMetrics: number;
  partialModel: PartialModel;
  subUserPartialModel: InputSubUserPartialModelSpiderChart[];
}

// needed to get exactly 1 level of partialModels 1 level of subPartialModels
export interface InputMaturityModelSpiderChart {
  nameMaturityModel: string;
  userPartialModels: InputUserPartialModelSpiderChart[];
}
