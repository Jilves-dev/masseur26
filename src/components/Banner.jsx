import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { bannar_down, banners } from '../data/Data';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
//import { BiChevronRight, BiChevronLeft } from "react-icons/bi";

const Banner = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    //nextArrow: <NextArrow />,
    //prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false, // Piilota nuolet mobiilissa
          //dots: true, // Näytä pisteet mobiilissa
        },
      },
    ],
  };

  {
    /* 
      arabian red  #A30B2E   #087652  #88AA0B  #4C6100  #B8F3FF  #8AC6D0
                bg colors:   #FFF8E7  #FAF6F0   #F5EFE6 #FFFAF0
      Mobile Layout: Kaksi kerrosta */
  }

  return (
    <div className="w-full bg-[#FFFFFF]">
      {/* Main Banner Slider */}
      <div className="w-full pt-2 px-2 md:w-10/12 md:mx-auto">
        <Slider ref={sliderRef} {...settings}>
          {banners.map((data, key) => (
            <div className="relative" key={key}>
              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-none md:rounded-lg">
                <img
                  src={data.banner}
                  alt="banner"
                  className="w-full h-full object-cover"
                />

                {/* Banner Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4 max-w-lg">
                    <h2 className="text-white text-sm md:text-base font-light uppercase tracking-wider mb-2">
                      Summer 2026 Offer
                    </h2>
                    <h1 className="text-white font-librecaslon text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 leading-tight">
                      {/*Get Up to 25% Off Select Bikes.
                      summer sale*/}
                      Get 25% off for <br />all normal Repairs
                    </h1>
                    <Link to="/repairs">
                      <button
                        type="button"
                        className="bg-[#E73725] hover:bg-red-700 font-zaslia text-white px-6 py-3 md:px-8 md:py-3 
                                 text-sm md:text-base 
                                 font-semibold uppercase tracking-wide transition-colors 
                                 duration-300 rounded-none"
                      >
                        Book Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Category Cards Below Banner */}
      <div className="w-full px-2 md:w-10/12 md:mx-auto mt-0 md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {bannar_down.map((val, index) => (
            <Link
              to={`/shop?category=${val.category}`}
              key={index}
              className="relative overflow-hidden group cursor-pointer"
            >
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <img
                  src={val.img}
                  alt={val.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Category Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center group-hover:bg-opacity-40 transition-all duration-300">
                  <div className="font-zaslia bg-white hover:bg-[#E73725] hover:text-white text-[#E73725] px-6 py-3 md:px-8 md:py-3 text-sm md:text-base font-semibold uppercase tracking-wide transition-all duration-300 transform group-hover:scale-105">
                    {val.name}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
