import React from 'react';
import { Link } from 'react-router-dom';

export const Heading = ({
  heading,
  subheading,
  description,
  hideHeadingOnMobile,
  useLogoHeading,
}) => {
  return (
    <div className="bg-[#FFFFFF]">
      <div className="text-center mt-8 mb-4">
        {useLogoHeading ? (
          <div className="flex justify-center">
            <Link
              className="font-racingSansOne text-lg md:text-2xl font-medium uppercase mb-2 flex items-center"
              to="/"
            >
              <span className="text-[#E73725]">F</span>
              <span className="text-[#333333]">REEWHEEL</span>
              <span className="text-[#E73725]">B</span>
              <span className="text-[#333333]">IKES</span>
              <img
                      src="/33591.svg"
                      alt=""
                      style={{ height: '1.5em', width: 'auto', display: 'inline-block', verticalAlign: 'middle' }}
                    />
              <span className="text-[#E73725]">C</span>
              <span className="text-[#333333]">OLLECTIONS</span>
            </Link>
          </div>
        ) : (
          <h4
            className={`font-zaslia text-xl md:text-2xl text-[#333333] font-semibold uppercase mb-2 ${hideHeadingOnMobile ? 'hidden md:block' : ''}`}
          >
            {heading}
          </h4>
        )}

        {/*<h1 className="text-4xl font-librecaslon text-[#E73725] uppercase font-semibold mb-2">{subheading}</h1>*/}
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-3xl md:text-4xl font-zaslia text-[#333333] uppercase font-medium mb-2">
            {subheading}
          </h1>
        </div>
        <p className="text-lg md:text-xl mb-2 font-librecaslon text-[#333333] text-center mx-auto whitespace-pre-line sm:whitespace-normal sm:max-w-sm md:max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  );
};
