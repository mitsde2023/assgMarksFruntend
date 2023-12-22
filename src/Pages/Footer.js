import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <div className="container">
      <div className='row'>
        <footer style={{ backgroundColor: "#f47521" }} className="text-white text-center py-1">
          <p>&copy; 2023 MITSDE</p>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
