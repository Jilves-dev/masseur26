import React from 'react';
import { Link } from 'react-router-dom';

export const NewDesignCover = () => {
  return (
    <div className="bg-design-cover py-12 md:py-24">
      <div className="w-11/12 md:w-10/12 m-auto text-left">
        <p className="font-librecaslon text-white text-base md:text-lg">
          Expert service, quality parts, fast turnaround
        </p>
        <h1 className="font-zaslia text-white text-4xl md:text-6xl uppercase font-semibold my-2 md:my-4">
          Keep Rolling
        </h1>
        <p className="font-librecaslon text-white pb-6 text-base md:text-lg">
          Tampere's trusted bike repair shop — tune-ups, overhauls & custom builds
        </p>
        <Link to="/repairs" className="!justify-start">
          <button
            type="button"
            className="bg-[#E73725] hover:bg-red-700 font-zaslia text-white px-6 py-3 md:px-8 md:py-3
                             text-sm md:text-base
                             font-semibold uppercase tracking-wide transition-colors
                             duration-300 rounded-none"
          >
            Book a Repair
          </button>
        </Link>
      </div>
    </div>
  );
};
