import gql from "graphql-tag";

// copy proposal
export const COPY_PROPOSAL_MUTATION = gql`
  mutation COPY_PROPOSAL_MUTATION($id: ID!, $study: ID) {
    copyProposalBoard(id: $id, study: $study) {
      id
      title
      slug
      description
      sections {
        id
        title
        description
        position
        cards {
          id
          title
          position
          section {
            id
          }
        }
      }
    }
  }
`;

export const CREATE_NEW_PROPOSAL = gql`
  mutation CREATE_NEW_PROPOSAL(
    $title: String!
    $description: String
    $settings: JSON
    $creatorId: ID!
  ) {
    createProposalBoard(
      data: {
        title: $title
        description: $description
        settings: $settings
        creator: { connect: { id: $creatorId } }
      }
    ) {
      id
    }
  }
`;

export const UPDATE_PROPOSAL_BOARD = gql`
  mutation UPDATE_PROPOSAL_BOARD(
    $id: ID!
    $title: String
    $description: String
    $isSubmitted: Boolean
    $checklist: JSON
    $isTemplate: Boolean
    $settings: JSON
  ) {
    updateProposalBoard(
      where: { id: $id }
      data: {
        title: $title
        description: $description
        isSubmitted: $isSubmitted
        checklist: $checklist
        isTemplate: $isTemplate
        settings: $settings
      }
    ) {
      id
    }
  }
`;

export const DELETE_PROPOSAL = gql`
  mutation DELETE_PROPOSAL($id: ID!) {
    deleteProposalBoard(where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_SECTION = gql`
  mutation CREATE_SECTION(
    $boardId: ID!
    $title: String!
    $description: String
    $position: Float!
  ) {
    createProposalSection(
      data: {
        board: { connect: { id: $boardId } }
        title: $title
        description: $description
        position: $position
      }
    ) {
      id
      title
      description
      position
    }
  }
`;

export const UPDATE_SECTION = gql`
  mutation UPDATE_SECTION(
    $id: ID!
    $boardId: ID!
    $title: String
    $description: String
    $position: Float
  ) {
    updateProposalSection(
      where: { id: $id }
      data: {
        board: { connect: { id: $boardId } }
        title: $title
        description: $description
        position: $position
      }
    ) {
      id
      title
      description
      position
      cards {
        id
        title
        position
        content
      }
    }
  }
`;

export const DELETE_SECTION = gql`
  mutation DELETE_SECTION($id: ID!, $boardId: ID!) {
    deleteProposalSection(where: { id: $id }) {
      id
    }
  }
`;

export const CREATE_CARD = gql`
  mutation CREATE_CARD(
    $title: String!
    $content: String
    $sectionId: ID!
    $position: Float!
  ) {
    createProposalCard(
      data: {
        section: { connect: { id: $sectionId } }
        title: $title
        content: $content
        position: $position
      }
    ) {
      id
      title
      content
      position
      section {
        id
      }
    }
  }
`;

export const UPDATE_CARD_POSITION = gql`
  mutation UPDATE_CARD_POSITION($id: ID!, $sectionId: ID, $position: Float) {
    updateProposalCard(
      where: { id: $id }
      data: { section: { connect: { id: $sectionId } }, position: $position }
    ) {
      id
      position
      section {
        id
      }
    }
  }
`;

export const UPDATE_CARD_CONTENT = gql`
  mutation UPDATE_CARD_CONTENT(
    $id: ID!
    $title: String
    $description: String
    $content: String
    $comment: String
    $settings: JSON
    $assignedTo: [ProfileWhereUniqueInput!]
  ) {
    updateProposalCard(
      where: { id: $id }
      data: {
        title: $title
        description: $description
        content: $content
        comment: $comment
        settings: $settings
        assignedTo: { set: $assignedTo }
      }
    ) {
      id
      title
      description
      content
      comment
      settings
      assignedTo {
        id
      }
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DELETE_CARD($id: ID!, $boardId: ID!) {
    deleteProposalCard(where: { id: $id }) {
      id
      section {
        id
      }
    }
  }
`;

export const DELETE_COMPLETE_PROPOSAL = gql`
  mutation DELETE_COMPLETE_PROPOSAL($id: ID!) {
    deleteProposal(id: $id) {
      id
    }
  }
`;
