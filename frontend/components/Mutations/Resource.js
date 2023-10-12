import gql from "graphql-tag";

// create assignment
export const CREATE_RESOURCE = gql`
mutation CREATE_RESOURCE($input: ResourceCreateInput!) {
  createResource(data: $input) {
    id
  }
}
`;

// edit assignment
export const EDIT_RESOURCE = gql`
  mutation EDIT_RESOURCE($id: ID!, $input: ResourceUpdateInput!) {
    updateResource(where: { id: $id }, data: $input) {
      id
    }
  }
`;

// delete assignment
export const DELETE_RESOURCE = gql`
  mutation DELETE_RESOURCE($id: ID!) {
    deleteResource(where: { id: $id }) {
      id
    }
  }
`;