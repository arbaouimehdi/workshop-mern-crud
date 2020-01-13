import { useQuery } from "@apollo/react-hooks";
import SigninBox from "../components/signin-box";
// import SignOutButton from "../components/SignOutButton"
import ME from "../queries/me";

const NewHome = () => {
  const { loading, error, data } = useQuery(ME);

  console.log(data);

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
    return (
      <>
        <p>Hi, {data.me.firstName}</p>
        <p>process.env.NODE_ENV is {process.env.NODE_ENV}</p>
      </>
    );
  }
};

export default NewHome;
