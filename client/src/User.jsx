import { useLoaderData } from "react-router-dom";

const User = () => {
  const { data } = useLoaderData();
  console.log(data);
  return <div>User</div>;
};

export default User;
