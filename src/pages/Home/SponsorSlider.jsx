// import React, { useState, useEffect } from "react";
// import { MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
// import person18 from "../../assets/usaAsset/homeScreen/person18.png";
// import person19 from "../../assets/usaAsset/homeScreen/person19.png";
// import person20 from "../../assets/usaAsset/homeScreen/person20.png";
// import sponserImage from "../../assets/Sponser/sponser option 1.jpg";
// import sponserImage2 from "../../assets/Sponser/sponser option 2.png";

// const sponsorImages = [
//   {
//     id: 1,
//     image: sponserImage,
//     link: "https://shivrambook.online/",
//   },
//   {
//     id: 2,
//     image: sponserImage,
//     link: "",
//   },
// ];

// const SponsorSlider = () => {
//   const [current, setCurrent] = useState(0);
//   const [isVisible, setIsVisible] = useState(true); // 👈 New state

//   const nextSlide = () => {
//     setCurrent((prev) => (prev === sponsorImages.length - 1 ? 0 : prev + 1));
//   };

//   const prevSlide = () => {
//     setCurrent((prev) => (prev === 0 ? sponsorImages.length - 1 : prev - 1));
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev === sponsorImages.length - 1 ? 0 : prev + 1));
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ Return early if not visible
//   if (!isVisible) return null;

//   return (
//     <div className="bg-[#242424] bg-opacity-90 flex items-center justify-center mb-0">
//       <div className="relative w-[350px] h-[100px] bg-[#242424] flex items-center justify-center rounded-md overflow-hidden">
//         {/* Sponsored Label */}
//         <span className="absolute top-1 left-1 bg-[#FFD700] text-black text-xs font-semibold px-2 py-[1px] rounded">
//           Sponsored
//         </span>

//         {/* Close Button */}
//         <button
//           onClick={() => setIsVisible(false)} // 👈 Close on click
//           className="absolute top-[-5px] right-[-0.3rem] z-20 bg-black bg-opacity-60 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
//         >
//           <MdClose />
//         </button>

//         {/* Left Arrow */}
//         {/* <button
//           onClick={prevSlide}
//           className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 p-1 rounded-full z-10"
//         >
//           <MdChevronLeft size={20} />
//         </button> */}

//         {/* Right Arrow */}
//         {/* <button
//           onClick={nextSlide}
//           className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 p-1 rounded-full z-10"
//         >
//           <MdChevronRight size={20} />
//         </button> */}

//         {/* Image */}
//         <a
//           href={sponsorImages[current].link}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <img
//             src={sponsorImages[current].image}
//             alt="Sponsor"
//             className="w-[95%] h-[95%] object-fill cursor-pointer"
//           />
//         </a>
//       </div>
//     </div>
//   );
// };

// export default SponsorSlider;

import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import sponserImage from "../../assets/Sponser/sponser option 1.jpg";
import sponserImage2 from "../../assets/Sponser/sponser option 2.png";
import {useNavigate} from "react-router-dom";

const sponsorImages = [
  {
    id: 1,
    image: sponserImage,
    // link: "https://shivrambook.online/",
  },
  {
    id: 2,
    image: sponserImage2,
    link: "https://shivrambook.online/",
  },
];

const SponsorSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sponsorImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-[#242424] bg-opacity-90 flex items-center justify-center mb-0">
      <div className="relative w-[350px] h-[100px] bg-[#242424] flex items-center justify-center rounded-md overflow-hidden">
        <span className="absolute top-1 left-1 bg-[#FFD700] text-black text-xs font-semibold px-2 py-[1px] rounded">
          Sponsored
        </span>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-[-5px] right-[-0.3rem] z-20 bg-black bg-opacity-60 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
        >
          <MdClose />
        </button>

        {/* Only one image at a time, faded in/out */}
        <a
          // href={sponsorImages[current].link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full flex justify-center items-center"
        >
          <img
            key={sponsorImages[current].id}
            src={sponsorImages[current].image}
            onClick={() => {
              if (sponsorImages[current].link) {
                window.open(sponsorImages[current].link, "_blank");
              }
            }}
            alt={`Sponsor ${current}`}
            className="w-[95%] h-[95%] object-fill cursor-pointer transition-opacity duration-700 opacity-100"
          />
        </a>
      </div>
    </div>
  );
};

export default SponsorSlider;




// import React, { useState, useEffect, useRef } from "react";
// import { MdClose } from "react-icons/md";
// import sponserImage from "../../assets/Sponser/sponser option 1.jpg";
// import sponserImage2 from "../../assets/Sponser/sponser option 2.png";

// const sponsorImages = [sponserImage, sponserImage2];

// const SponsorSlider = () => {
//   const [current, setCurrent] = useState(0);
//   const [isVisible, setIsVisible] = useState(true);
//   const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
//   const imageRef = useRef(null);

//   useEffect(() => {
//     const updateSize = () => {
//       if (imageRef.current) {
//         setImageSize({
//           width: imageRef.current.offsetWidth,
//           height: imageRef.current.offsetHeight,
//         });
//       }
//     };

//     // Update on mount and image change
//     updateSize();
//     window.addEventListener("resize", updateSize);

//     return () => window.removeEventListener("resize", updateSize);
//   }, [current]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev === sponsorImages.length - 1 ? 0 : prev + 1));
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   if (!isVisible) return null;

//   return (
//     <div className="bg-[#242424] bg-opacity-90 flex items-center justify-center mb-0">
//       <div
//         className="relative"
//         style={{ width: imageSize.width, height: imageSize.height }}
//       >
//         {/* Image */}
//         <img
//           ref={imageRef}
//           src={sponsorImages[current]}
//           alt="Sponsor"
//           className="object-contain max-w-full max-h-full rounded-md"
//           onLoad={() => {
//             if (imageRef.current) {
//               setImageSize({
//                 width: imageRef.current.offsetWidth,
//                 height: imageRef.current.offsetHeight,
//               });
//             }
//           }}
//         />

//         {/* Sponsored Label */}
//         <span className="absolute top-1 left-2 bg-[#FFD700] text-black text-[10px] font-semibold px-1 py-[1px] rounded">
//           Sponsored
//         </span>

//         {/* ❌ Close Button placed top-right of actual image */}
//         <button
//           onClick={() => setIsVisible(false)}
//           className="absolute top-1 right-1 bg-black bg-opacity-60 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10"
//         >
//           <MdClose size={12} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SponsorSlider;



// import React, { useState, useEffect, useRef } from "react";
// import { MdClose } from "react-icons/md";
// import sponserImage from "../../assets/Sponser/sponser option 1.jpg";
// import sponserImage2 from "../../assets/Sponser/sponser option 2.png";

// const sponsorImages = [sponserImage, sponserImage2];

// const SponsorSlider = () => {
//   const [current, setCurrent] = useState(0);
//   const [isVisible, setIsVisible] = useState(true);
//   const [imageWidth, setImageWidth] = useState(300);
//   const imgRef = useRef(null);

//   const nextSlide = () => {
//     setCurrent((prev) => (prev === sponsorImages.length - 1 ? 0 : prev + 1));
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev === sponsorImages.length - 1 ? 0 : prev + 1));
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const img = imgRef.current;
//     if (img) {
//       const handleLoad = () => setImageWidth(img.offsetWidth);
//       img.addEventListener("load", handleLoad);
//       handleLoad(); // in case already loaded
//       return () => img.removeEventListener("load", handleLoad);
//     }
//   }, [current]);

//   if (!isVisible) return null;

//   return (
//     <div className="bg-[#242424] bg-opacity-90 flex items-center justify-center mb-0">
//       <div
//         className="relative h-[100px] bg-[#242424] flex items-center justify-center rounded-md overflow-hidden"
//         style={{ width: `${imageWidth}px` }}
//       >
//         {/* Sponsored Label */}
//         <span className="absolute top-2 left-10 bg-[#FFD700] text-white text-xs font-semibold px-2 py-[1px] rounded">
//           Sponsored
//         </span>

//         {/* Cross Button */}
//         <button
//           onClick={() => setIsVisible(false)}
//           className="absolute top-2 right-2 bg-black bg-opacity-60 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold z-10"
//         >
//           <MdClose />
//         </button>

//         {/* Image */}
//         <img
//           ref={imgRef}
//           src={sponsorImages[current]}
//           alt="Sponsor"
//           className="max-w-full max-h-full object-contain"
//         />
//       </div>
//     </div>
//   );
// };

// export default SponsorSlider;
