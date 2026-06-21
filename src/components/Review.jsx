import React from 'react';
import Slider from 'react-slick';
import { reviews } from '../data/Data';

export const Review = () => {
  const settings = {
    arrows: true,
    responsive: [{ breakpoint: 768, settings: { arrows: false } }],
  };

  return (
    <div className="bg-image">
      <div className="bg-image-overlay"></div>
      <Slider {...settings}>
        {reviews.map((data, key) => (
          <div key={key} className="w-11/12 md:w-10/12 m-auto py-8 md:py-12">
            <div className="flex justify-center text-center">
              <div className="max-w-4xl px-4">
                <h1 className="font-zaslia text-4xl sm:text-5xl md:text-6xl uppercase text-white mb-4 md:mb-6 font-semibold">
                  {data.title}
                </h1>
                <p className="font-librecaslon text-white text-sm sm:text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                  {data.description}
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center mt-5 gap-4">
                  <div className="rounded-full w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                    <img
                      className="rounded-full w-full h-full object-cover"
                      src={data.customer_img}
                      alt={data.customer_name}
                    />
                  </div>
                  <div className="text-center sm:text-start">
                    <h4 className="font-qiswah text-white font-bold text-lg md:text-xl">
                      {data.customer_name}
                    </h4>
                    <p className="font-qiswah text-white text-sm md:text-base">
                      {data.position}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
