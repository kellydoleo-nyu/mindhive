import gql from "graphql-tag";

// get assignment by code
export const GET_RESOURCE = gql`
  query GET_RESOURCE($code: String!) {
    resource(where: { code: $code }) {
      id
      code
      title
      content
      homework {
        id
        code
        title
        public
        content
        settings
        author {
          id
          username
          publicReadableId
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// get assignment for students to complete
export const GET_RESOURCE_FOR_STUDENT = gql`
  query GET_RESOURCE_FOR_STUDENT($code: String!) {
    reource(where: { code: $code }) {
      id
      code
      title
      content
    }
  }
`;

// get all my and class assignments
export const GET_MY_CLASS_RESOURCES = gql`
  query GET_MY_CLASS_RESOURCES($userId: ID!, $classId: ID) {
    resources(
      where: {
        OR: [
          { author: { id: { equals: $userId } } }
          { classes: { some: { id: { equals: $classId } } } }
        ]
      }
    ) {
      id
      code
      title
      content
      author {
        username
      }
      public
      homework {
        public
      }
    }
  }
`;

// get template assignments
export const GET_ALL_RESOURCES = gql`
  query GET_ALL_RESOURCES {
    resources {
      id
      code
      title
      content
      author {
        username
      }
    }
  }
`;
