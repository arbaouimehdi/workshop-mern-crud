import { gql } from "apollo-boost";

const Me = gql`
  query ME_QUERY {
    me {
      id
      firstName
    }
  }
`;

export default Me;
