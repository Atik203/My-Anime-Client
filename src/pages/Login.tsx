import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div>
      <h1>This is Login component</h1>
      <Link to={"/register"}>Register</Link>
    </div>
  );
};

export default Login;
