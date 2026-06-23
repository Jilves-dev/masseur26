import React from 'react';
import { Link } from 'react-router-dom';

const PageHeading = ({ pagename }) => {
  return (
    <div>
      <div className="bg-[#FFFFFF] text-center p-10">
        <h1 className="font-racingSansOne text-4xl font-medium">{pagename}</h1>
      </div>
    </div>
  );
};

export default PageHeading;
