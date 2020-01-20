import { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";

import IsAuth from "../components/is-auth";
import ME from "../queries/me";

const UPDATE_USER = gql`
  mutation UPDATE_USER(
    $userId: ID!
    $firstName: String!
    $lastName: String!
    $password: String!
  ) {
    updateUserInfos(
      userId: $userId
      firstName: $firstName
      lastName: $lastName
      password: $password
    ) {
      token
    }
  }
`;

const Profile = () => {
  return (
    <IsAuth>
      <Mutation
        mutation={UPDATE_USER}
        refetchQueries={[{ query: ME }]}
        onError={error => console.log(error)}
      >
        {(updateUserInfos, { data, loading, error }) => {
          const { data: currentUser } = useQuery(ME);

          const [userId, setUserID] = useState(currentUser.me.id);
          const [firstName, setFirstName] = useState(currentUser.me.firstName);
          const [lastName, setLastName] = useState(currentUser.me.lastName);
          const [password, setPassword] = useState("");

          return (
            <div>
              <h1>Profile</h1>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateUserInfos({
                    variables: {
                      userId,
                      firstName,
                      lastName,
                      password
                    }
                  });
                }}
              >
                {error && <p>{error.message}</p>}
                <div>
                  <input
                    name="firstName"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    type="text"
                    style={{
                      padding: "5px",
                      width: "200px",
                      marginBottom: "10px"
                    }}
                  />
                </div>

                <div>
                  <input
                    name="lastName"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    type="text"
                    style={{
                      padding: "5px",
                      width: "200px",
                      marginBottom: "10px"
                    }}
                  />
                </div>

                <div>
                  <input
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    style={{
                      padding: "5px",
                      width: "200px",
                      marginBottom: "10px"
                    }}
                  />
                </div>

                <br />
                <button
                  style={{
                    background: "#118420",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "3px",
                    fontSize: "14px"
                  }}
                >
                  {loading ? "Loading" : "Update Profile"}
                </button>
              </form>
            </div>
          );
        }}
      </Mutation>
    </IsAuth>
  );
};

export default Profile;
