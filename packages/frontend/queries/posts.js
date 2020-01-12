import { gql } from "apollo-boost"

const Posts = gql`
  query Posts {
    publishedPosts {
      id
      title
    }
  }
`

export default Posts
