import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};



export type Query = {
  __typename?: 'Query';
  project?: Maybe<Project>;
  projects?: Maybe<Array<Project>>;
  projectOfUser?: Maybe<Project>;
  projectsOfUser?: Maybe<Array<Project>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  profileOfUser: User;
  maturityModel?: Maybe<MaturityModel>;
  maturityModels?: Maybe<Array<MaturityModel>>;
  maturityModelOfUser?: Maybe<MaturityModel>;
  maturityModelsOfUser?: Maybe<Array<MaturityModel>>;
  userPartialModel?: Maybe<UserPartialModel>;
  userPartialModels?: Maybe<Array<UserPartialModel>>;
  userEvaluationMetric?: Maybe<UserEvaluationMetric>;
  userEvaluationMetrics?: Maybe<Array<UserEvaluationMetric>>;
  partialModel?: Maybe<PartialModel>;
  partialModels: Array<PartialModel>;
  evaluationMetric?: Maybe<EvaluationMetric>;
  evaluationMetrics: Array<EvaluationMetric>;
};


export type QueryProjectArgs = {
  id: Scalars['ID'];
};


export type QueryProjectOfUserArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryMaturityModelArgs = {
  id: Scalars['ID'];
};


export type QueryMaturityModelOfUserArgs = {
  id: Scalars['ID'];
};


export type QueryUserPartialModelArgs = {
  id: Scalars['ID'];
};


export type QueryUserEvaluationMetricArgs = {
  id: Scalars['ID'];
};


export type QueryPartialModelArgs = {
  id: Scalars['ID'];
};


export type QueryEvaluationMetricArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<Scalars['String']>;
  register?: Maybe<Scalars['String']>;
};


export type MutationLoginArgs = {
  userLoginRequest: UserLoginRequest;
};


export type MutationRegisterArgs = {
  userRegistrationRequest: UserRegistrationRequest;
};

export type UserLoginRequest = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserRegistrationRequest = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  email: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  verified: Scalars['Boolean'];
  projects?: Maybe<Array<Project>>;
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  user: User;
  maturityModels: Array<MaturityModel>;
  created: Scalars['String'];
  updated: Scalars['String'];
};

export type MaturityModel = {
  __typename?: 'MaturityModel';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  maturityLevel?: Maybe<Scalars['Float']>;
  projects: Array<Project>;
  userPartialModels: Array<UserPartialModel>;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type UserPartialModel = {
  __typename?: 'UserPartialModel';
  id: Scalars['ID'];
  maturityLevelEvaluationMetrics?: Maybe<Scalars['Float']>;
  maturityModel: MaturityModel;
  superUserPartialModel?: Maybe<UserPartialModel>;
  subUserPartialModels: Array<Maybe<UserPartialModel>>;
  userEvaluationMetrics: Array<UserEvaluationMetric>;
  partialModel: PartialModel;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type UserEvaluationMetric = {
  __typename?: 'UserEvaluationMetric';
  id: Scalars['ID'];
  valueEvaluationMetric: Scalars['Float'];
  userPartialModel: UserPartialModel;
  evaluationMetric: EvaluationMetric;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type PartialModel = {
  __typename?: 'PartialModel';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
  evaluationMetrics: Array<EvaluationMetric>;
  subPartialModels?: Maybe<Array<PartialModel>>;
  superPartialModel?: Maybe<PartialModel>;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type EvaluationMetric = {
  __typename?: 'EvaluationMetric';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
  partialModel?: Maybe<PartialModel>;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);

export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $firstname: String!, $lastname: String!) {
  register(
    userRegistrationRequest: {email: $email, password: $password, firstname: $firstname, lastname: $lastname}
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterGQL extends Apollo.Mutation<RegisterMutation, RegisterMutationVariables> {
    document = RegisterDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }