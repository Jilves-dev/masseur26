const Mani = () => {
  return (
    <div className="bg-[#A30B2E] min-h-screen flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-2xl">
        {/* Kuva tekstin yläpuolella */}
        <img
          src="/images/banner1.jpg"
          alt="Banner"
          className="w-full h-auto mb-6 rounded-lg shadow-lg"
        />

        {/* Otsikko */}
        <div className="font-zaslia text-5xl flex items-center justify-center text-white mb-2">
          <span>FLYING</span>
          <span className="ml-2">CARPETS</span>
          <img
            src="/images/lantern32.png"
            alt=""
            className="inline-block w-auto align-middle ml-0 mani-lantern-icon"
          />
        </div>

        {/* Alaotsikko 
          <p className="font-librecaslon text-white text-xl pr-6">Premium carpets for your home</p>*/}
      </div>
    </div>
  );
};

export default Mani;
