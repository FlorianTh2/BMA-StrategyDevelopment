import { UserPartialModel } from "../graphql/generated/graphql";

export interface TreeItem {
  type?: string;
  element: TreeItem[];
}

export interface UserPartialModelItem {
  type?: string;
  element: UserPartialModel[];
}

export const data: TreeItem = {
  type: "",
  element: [
    {
      type: "",
      element: [
        {
          type: "",
          element: [
            {
              type: "",
              element: [
                {
                  type: "",
                  element: [
                    {
                      type: "",
                      element: []
                    },
                    {
                      type: "",
                      element: [
                        {
                          type: "",
                          element: [
                            {
                              type: "",
                              element: [
                                {
                                  type: "",
                                  element: [
                                    {
                                      type: "",
                                      element: []
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              type: "",
                              element: []
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: "",
                      element: []
                    }
                  ]
                },
                {
                  type: "",
                  element: []
                }
              ]
            }
          ]
        },
        {
          type: "",
          element: []
        },
        {
          type: "",
          element: []
        }
      ]
    }
  ]
};
