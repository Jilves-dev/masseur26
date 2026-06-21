import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Icon = () => {
  return (
    <div>
      <div className="flex">
        <Link className="mr-6 text-xl text-red-600">
          <FaFacebook />
        </Link>
        <Link className="mr-6 text-xl text-red-600">
          <FaLinkedin />
        </Link>
        <Link className="mr-6 text-xl text-red-600">
          <FaYoutube />
        </Link>
        <Link className="mr-6 text-xl text-red-600">
          <FaInstagram />
        </Link>
      </div>
    </div>
  );
};

export default Icon;
