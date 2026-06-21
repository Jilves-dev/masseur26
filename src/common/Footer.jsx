import React from 'react';
import { footer } from '../data/Data';

const Footer = () => {
  return (
    <div className="bg-gray-900">
      <div className="w-full px-4 md:w-10/12 md:px-0 mx-auto">
        {/* Mobile Layout: Vertical Stack */}
        <div className="block md:hidden py-8">
          {/* Logo ja kuvaus mobile */}
          <div className="mb-8">
            <div className="mb-4 font-racingSansOne text-center desktop-logo">
              <span className="text-xl text-[#E73725] font-bold">F</span>
              <span className="text-xl text-white font-bold">REEWHEEL </span>
              <span className="text-xl text-[#E73725] font-bold">B</span>
              <span className="text-xl text-white font-bold">IKES</span>
            </div>
            <p className="text-white font-librecaslon text-sm text-center leading-relaxed">
              Freewheel Bikes is your local expert for bicycle repairs,
              premium bikes, and quality parts in Tampere.
            </p>
          </div>

          {/* Footer-sarakkeet mobile - pystysuuntainen layout */}
          <div className="space-y-6">
            {footer.map((val, index) => (
              <div className="text-white" key={index}>
                <h2 className="text-lg font-zaslia text-center font-semibold mb-3 text-white border-b border-gray-700 pb-2">
                  {val.header}
                </h2>
                <div className="space-y-2 text-sm text-center">
                  {val.content1 && (
                    <p className="hover:text-white transition-colors cursor-pointer">
                      {val.content1}
                    </p>
                  )}
                  {val.content2 && (
                    <p className="hover:text-white transition-colors cursor-pointer">
                      {val.content2}
                    </p>
                  )}
                  {val.content3 && (
                    <p className="hover:text-white transition-colors cursor-pointer">
                      {val.content3}
                    </p>
                  )}
                  {val.content4 && (
                    <p className="hover:text-white transition-colors cursor-pointer">
                      {val.content4}
                    </p>
                  )}
                  {val.content5 && (
                    <p className="hover:text-white transition-colors cursor-pointer">
                      {val.content5}
                    </p>
                  )}
                  {val.content6 && (
                    <p className="hover:text-white transition-colors cursor-pointer">
                      {val.content6}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout: Horizontal */}
        <div className="hidden md:flex justify-between pt-14 pb-14">
          {/* Logo ja kuvaus desktop */}
          <div className="w-1/4 pr-8">
            <div className="font-zaslia mb-5 desktop-logo">
              <span className="text-2xl text-[#E73725] font-bold">F</span>
              <span className="text-2xl !text-white font-bold">REEWHEEL</span>
              <span className="text-2xl text-[#E73725] font-bold">B</span>
              <span className="text-2xl !text-white font-bold">IKES</span>
            </div>
            <p className="font-librecaslon text-sm text-white leading-relaxed">
              Freewheel Bikes is your local expert for bicycle repairs,
              premium bikes, and quality parts in Tampere.
            </p>
          </div>

          {/* Footer-sarakkeet desktop */}
          {footer.map((val, index) => (
            <div className="text-white flex-1 px-4" key={index}>
              <h1 className="text-xl mb-5 font-zaslia font-semibold">
                {val.header}
              </h1>
              <div className="font-librecaslon space-y-2 text-sm">
                {val.content1 && (
                  <p className="hover:text-white transition-colors cursor-pointer">
                    {val.content1}
                  </p>
                )}
                {val.content2 && (
                  <p className="hover:text-white transition-colors cursor-pointer">
                    {val.content2}
                  </p>
                )}
                {val.content3 && (
                  <p className="hover:text-white transition-colors cursor-pointer">
                    {val.content3}
                  </p>
                )}
                {val.content4 && (
                  <p className="hover:text-white transition-colors cursor-pointer">
                    {val.content4}
                  </p>
                )}
                {val.content5 && (
                  <p className="hover:text-white transition-colors cursor-pointer">
                    {val.content5}
                  </p>
                )}
                {val.content6 && (
                  <p className="hover:text-white transition-colors cursor-pointer">
                    {val.content6}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Copyright/Bottom section - sama kaikille näyttökokoille */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-white text-xs md:text-sm">
            <p className="font-librecaslon mb-2 md:mb-0">
              @2026 Freewheel Bikes. All rights reserved.
            </p>
            <div className="font-librecaslon flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
        <br /> 
      </div>
    </div>
  );
};

export default Footer;
