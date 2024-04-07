import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h2>The Path/Route does not exist</h2>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default NotFound;
