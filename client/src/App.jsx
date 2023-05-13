import { Link } from "react-router-dom";

const App = () => {
  return (
    <div>
      Home Page <Link to={`user/64535a16c01a522d6a92cab7`}>Go to Account</Link>
    </div>
  );
};

export default App;
