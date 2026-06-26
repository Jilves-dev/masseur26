import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { FaSun } from 'react-icons/fa';

const TopBar = () => {
  return (
    <div className="bg-[#b9975b]">
      {/* bg-[#E73725]
      arabian red  #A30B2E   #087652  #88AA0B  #4C6100  #B8F3FF  #8AC6D0
                bg colors:   #FFF8E7  #FAF6F0   #F5EFE6 #FFFAF0
      Mobile Layout: Kaksi kerrosta */}
      <div className="block md:hidden">
        {/* Ylärivi: Summer Sale */}
        <div className="flex items-center justify-center py-2 px-2">
          <span className="text-white text-sm font-zaslia font-medium flex items-center gap-1">
            <FaSun className="text-yellow-400 text-base" />
            KESÄ 2026 ALE
            <FaSun className="text-yellow-400 text-base" />
          </span>
        </div>

        {/* Alarivi: Free shipping */}
        <div className="flex items-center justify-center py-2 px-2">
          <span className="text-white text-md font-librecaslon font-medium flex items-center gap-1">
            Ilmainen postitus🚚kaikkiin yli €150 ostoksiin
          </span>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Link className="mr-2 text-white uppercase border-l-2 pr-4 pl-4 border-r-2 text-sm hover:bg-red-700 transition-colors">
              ENGLISH
            </Link>
            <Link className="mr-2 text-white uppercase border-r-2 pl-2 pr-4 text-sm hover:bg-red-700 transition-colors">
              € EUR
            </Link>
            <Link className="mr-2 text-white uppercase pl-2 text-sm hover:bg-red-700 transition-colors">
              25% alennus kaikkiin yli €150 lahjakortti ostoksiin
            </Link>
          </div>
          <div className="flex items-center">
            <Icon />
            <Link
              className="mr-5 text-white uppercase pl-4 border-l-2 border-r-2 pr-4 text-sm hover:bg-red-700 transition-colors"
              to="contact"
            >
              Yhteystiedot
            </Link>
            <Link className="mr-5 text-white uppercase border-r-2 pr-4 text-sm hover:bg-red-700 transition-colors">
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
