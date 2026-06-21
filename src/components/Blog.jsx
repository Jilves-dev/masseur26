import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Heading } from '../common/Heading';
import { blogs } from '../data/Data';

export const Blog = () => {
  const sliderRef = useRef(null);
  // Optimoidut slider-asetukset kaikille näyttökokoille
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: false,
    autoplaySpeed: 2000,
    arrows: true,
    swipeToSlide: true, // Parempi mobiilikäyttöliittymä
    touchThreshold: 10, // Herkempi kosketukselle
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
          //dots: true, // Dots mobile-näkymässä
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Piilota nuolet pienimmässä näkymässä
          //dots: true,
          centerMode: true,
          centerPadding: '20px',
          swipeToSlide: true,
        },
      },
    ],
  };

  return (
    <div className="w-full bg-[#FFFFFF] pb-8">
      <div>
        <Heading
          useLogoHeading={true}
          //heading={"Flying Carpet's Collections"}
          subheading={'Latest From Blog'}
          description={'all you need to know stay on top of fashion'}
        />
      </div>
      {/* Yhtenäinen Slider-layout kaikille näyttökokoille */}
      <div className="w-full px-2 md:px-0"></div>
      <div className="w-full md:w-10/12 m-auto">
        <Slider ref={sliderRef} {...settings}>
          {blogs.map((val, key) => (
            <div className="flex gap-8 mt-4" key={key}>
              <div className="overflow-hidden relative m-2 border bg-white">
                <div className="image-container relative">
                  <img src={val.img} alt="blog" className="w-full" />

                  <div className="tag absolute top-0 right-0 z-10">
                    <p className="bg-[#E1E1E1] w-12 font-zaslia text-center grid place-items-center text-black p-2 uppercase">
                      {val.tag}
                    </p>
                  </div>
                </div>
                <div className="product-details text-center mt-4 mb-4 bg-white">
                  <p className="font-librecaslon text-lg mb-2">
                    {val.short_description}
                  </p>
                  <p className="font-qiswah text-2xl mb-2">{val.title}</p>
                  <p className="font-librecaslon text-black text-xl">
                    {val.read_more}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
