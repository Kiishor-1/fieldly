import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center font-poppins">
      <h1 className="text-5xl text-teal-500">404</h1>
      <p className="text-lg my-4">Oops! The page you are looking for does not exist.</p>
      <Link className="text-teal-500 text-base hover:underline" to="/">Go back to Home</Link>
    </div>
  );
};

export default NotFound;
