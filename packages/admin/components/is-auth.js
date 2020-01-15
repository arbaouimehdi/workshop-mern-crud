import { useQuery } from "@apollo/react-hooks";
import Router from "next/router";

//
import SigninBox from "../components/signin-box";
import ME from "../queries/me";

const IsAuth = ({ children }) => {
  const { loading, error, data } = useQuery(ME);

  if (error) console.log("error message is: ", error.message);
  if (loading) return <p>loading</p>;

  if (data === undefined || data.me === undefined || data.me === null) {
    return (
      <>
        <p>You are not signed in!</p>
        <SigninBox />
      </>
    );
  } else {
    return <div>{children}</div>;
  }
};

export default IsAuth;
