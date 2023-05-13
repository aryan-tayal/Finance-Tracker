import { useLoaderData } from "react-router-dom";

const User = () => {
  const { user } = useLoaderData();
  console.log(user);
  return <div>User</div>;
};

export default User;
