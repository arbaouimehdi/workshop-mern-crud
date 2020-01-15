import { useState } from "react";
// import { gql } from "apollo-boost"
import { useMutation } from "@apollo/react-hooks";
import ME from "../queries/me";
import SIGN_IN from "../mutations/sign_in";

const SigninBox = () => {
  const [email, setEmail] = useState("arbaoui.mehdi86@gmail.com");
  const [password, setPassword] = useState("mm123456");

  const [signin, { error, loading, data }] = useMutation(SIGN_IN, {
    onCompleted(data) {
      const { login } = data;
      // console.log("token is:", login.token);
    }
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        signin({
          variables: {
            email,
            password
          },
          refetchQueries: [{ query: ME }]
        });
      }}
    >
      {error && <p>Error is: {error.message}</p>}
      <input
        name="email"
        placeholder="Email"
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <input
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br />
      <button>{loading ? "Loading" : "Sign in"}</button>
    </form>
  );
};

export default SigninBox;
