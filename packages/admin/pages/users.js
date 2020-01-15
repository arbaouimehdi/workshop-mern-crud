import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

// Libraries
import IsAuth from "../components/is-auth";

const ALL_USERS = gql`
  query ALL_USERS {
    users {
      id
      firstName
      lastName
      email
    }
  }
`;

const UsersList = () => {
  const { error, loading, data } = useQuery(ALL_USERS);

  if (error) console.log(error.message);
  if (loading) return <p>Loading</p>;

  return (
    <IsAuth>
      {data.users.map(user => {
        return (
          <div key={user.id}>
            <p>{`Name: ${user.firstName} ${user.lastName}`}</p>
            <p>{`Email: ${user.email}`}</p>
            <p>----------------------------------------------------------</p>
          </div>
        );
      })}
    </IsAuth>
  );
};

export default UsersList;
