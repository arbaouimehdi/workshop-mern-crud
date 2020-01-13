import { gql } from "apollo-boost";

const ME = gql`
  query ME_QUERY {
    me {
      id
      firstName
    }
  }
`;

export default ME;
