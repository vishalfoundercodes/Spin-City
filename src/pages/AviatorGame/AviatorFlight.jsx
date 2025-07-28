// /* eslint-disable react/prop-types */
// import { useEffect, useState, useRef } from "react";
// import { Stage, Layer, Line } from "react-konva";
// import aviator from "../../assets/usaAsset/aviator/aviator.gif";
// import fan_aviator from "../../assets/usaAsset/aviator/fan_aviator.gif";
// import chakra from "../../assets/usaAsset/aviator/chakra.png";
// import { socket } from "./AviatorSocket";
// import ProgressBarIndicator from "./ProgressBarIndicator";
// import bg_one from '../../assets/usaAsset/aviator/bg_one.png';
// import bg_two from '../../assets/usaAsset/aviator/bg_two.png';
// import bg_three from '../../assets/usaAsset/aviator/bg_three.png';
// import bg_four from '../../assets/usaAsset/aviator/bg_four.png';
// import bg_five from '../../assets/usaAsset/aviator/bg_five.png';

// function AviatorFlight({ changeBg, setChangeBg, isSoundOn, setIsSoundOn, isPathRemoved, setIsPathRemoved }) {
    // // const audioRef = useRef(null);
    // const [isOscillating, setIsOscillating] = useState(false);
    // const [isResetting, setIsResetting] = useState(false);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [aviatorX, setAviatorX] = useState(0);
    // const [aviatorY, setAviatorY] = useState(0);
    // const [trajectoryPoints, setTrajectoryPoints] = useState([]);
    // const parentRef = useRef(null);
    // const [dots, setDots] = useState([]);
    // let oscillationStartY = 0;
    // const [hotAirData, setHotAirData] = useState(null);
    // useEffect(() => {
    //     const handleSocket = (hotair) => {
    //         const q = JSON.parse(hotair);
    //         setHotAirData(q);
    //     };

    //     socket.on("rootspinity_aviators", handleSocket);
    //     return () => socket.off("rootspinity_aviators", handleSocket);
    // }, []);
    // // console.log("hotAirData",hotAirData)

    // // useEffect(() => {
    // //     if (audioRef.current) {
    // //         if (isSoundOn) {
    // //             audioRef.current.play().catch(error => console.error("Audio play error:", error));
    // //         } else {
    // //             audioRef.current.pause();
    // //             audioRef.current.currentTime = 0; // Reset to start when toggled on again
    // //         }
    // //     }
    // // }, [isSoundOn]);

    // useEffect(() => {
    //     const img = localStorage.getItem("aviatorBg")
    //     if (img) {
    //         // console.log("bgimage",img)
    //         setChangeBg({ modal: false, selectBg: false, image: img })
    //     }
    // }, [changeBg?.selectBg])

    // useEffect(() => {
    //     if (hotAirData?.status === 0) {
    //         // setIsSoundOn(false)
    //         setIsResetting(true); // Hide aviator before resetting
    //         setAviatorX(-1000);  // Move it far outside the screen
    //         setAviatorY(-1000);

    //         setTimeout(() => {
    //             setAviatorX(0);
    //             setAviatorY(0);
    //             setTrajectoryPoints([]);
    //             setIsResetting(false); // Show aviator after reset
    //             setIsModalOpen(true);
    //         }, 50); // Short delay to ensure the transition is not visible
    //     }
    //     if (hotAirData?.status === 1) setIsSoundOn(true)
    // }, [hotAirData?.status]);

    // useEffect(() => {
    //     let animationFrame;
    //     let startTime = performance.now();
    //     let duration = 7000;
    //     let parentWidth = 800, parentHeight = 600;
    //     let oscillationFactor = 0;

    //     function updateDimensions() {
    //         if (parentRef.current) {
    //             parentWidth = parentRef.current.clientWidth;
    //             parentHeight = parentRef.current.clientHeight;
    //         }
    //     }

    //     function animate(time) {
    //         updateDimensions();
    //         let elapsed = time - startTime;

    //         if (hotAirData?.status === 0) {
    //             if (hotAirData?.status === 0) {
    //                 setIsResetting(true); // Hide aviator before resetting
    //                 setAviatorX(-1000);  // Move it far outside the screen
    //                 setAviatorY(-1000);

    //                 setTimeout(() => {
    //                     setAviatorX(0);
    //                     setAviatorY(0);
    //                     setTrajectoryPoints([]);
    //                     setIsResetting(false); // Show aviator after reset
    //                     setIsModalOpen(true);
    //                 }, 50); // Short delay to ensure the transition is not visible
    //             }
    //             setIsModalOpen(true);
    //         } else if (hotAirData?.status === 1) {
    //             const screenWidth = window.innerWidth;
    //             setIsModalOpen(false);
    //             let progress = Math.min(elapsed / duration, 1);
    //             let curveY = Math.pow(progress, 2.5) * 0.66 * parentHeight;
    //             let curveX = progress * 0.65 * parentWidth;
    //             if (screenWidth < 640) {
    //                 curveY = Math.pow(progress, 2.5) * 0.60 * parentHeight;
    //                 curveX = progress * 0.65 * parentWidth;
    //             } else {
    //                 curveY = Math.pow(progress, 2.5) * 0.76 * parentHeight;
    //                 curveX = progress * 0.75 * parentWidth;
    //             }

    //             if (progress < 1) {
    //                 setAviatorX(curveX);
    //                 setAviatorY(-curveY);
    //                 setTrajectoryPoints((prev) => [...prev, { x: curveX, y: curveY }]);
    //                 oscillationStartY = -curveY;
    //             } else {
    //                 if (!isOscillating) {
    //                     setIsOscillating(true);
    //                 }
    //                 oscillationFactor = Math.sin(time / 200) * 0.5;
    //                 setAviatorY((prevY) => prevY + oscillationFactor);
    //                 setTrajectoryPoints((prev) => prev.map((p) => ({
    //                     x: p.x,
    //                     y: p.y + oscillationFactor * (p.y / oscillationStartY)
    //                 })));
    //                 // setAviatorY(oscillationY);
    //             }
    //         } else if (hotAirData?.status === 2) {
    //             setIsOscillating(false);
    //             let flyProgress = Math.min(elapsed / 2000, 1);
    //             let flyX = aviatorX + flyProgress * 2.5 * parentWidth;  // Adjust X movement
    //             let flyY = aviatorY - flyProgress * 1.5 * parentHeight; // Adjust Y movement
    //             setAviatorX(flyX);
    //             setAviatorY(flyY);
    //             setTrajectoryPoints([]);
    //             if (!isModalOpen) {
    //                 setIsModalOpen(true); // Ensure it is set only once
    //             }
    //         }
    //         animationFrame = requestAnimationFrame(animate);
    //     }

    //     if (hotAirData?.status > 0) {
    //         animationFrame = requestAnimationFrame(animate);
    //     }

    //     return () => cancelAnimationFrame(animationFrame);
    // }, [hotAirData?.status]);
    // useEffect(() => {
    //     let animationFrame;
    //     const dotSpeed = 1;
    //     const dotSpacing = 50;
    //     // const containerHeight = parentRef.current?.clientHeight || 600;
    //     function initializeDots() {
    //         let dotsArray = [];
    //         let parentWidth = parentRef.current?.clientWidth || 800;
    //         let parentHeight = parentRef.current?.clientHeight || 600;

    //         for (let i = 0; i < Math.ceil(parentWidth / dotSpacing); i++) {
    //             for (let j = 0; j < Math.ceil(parentHeight / dotSpacing); j++) {
    //                 dotsArray.push({
    //                     id: `${i}-${j}`,
    //                     x: i * dotSpacing,
    //                     y: j * dotSpacing,
    //                 });
    //             }
    //         }
    //         return dotsArray;
    //     }
    //     function animateDots() {
    //         setDots((prevDots) =>
    //             prevDots.map((dot) => ({
    //                 id: dot.id,
    //                 x: dot.x + dotSpeed < parentRef.current?.clientWidth ? dot.x + dotSpeed : 0,
    //                 y: dot.y + dotSpeed < parentRef.current?.clientHeight ? dot.y + dotSpeed : 0,
    //             }))
    //         );
    //         animationFrame = requestAnimationFrame(animateDots);
    //     }
    //     if ((hotAirData?.status === 1 || hotAirData?.status === 2) && dots.length === 0) {
    //         setDots(initializeDots());
    //     }

    //     if (hotAirData?.status === 1 || hotAirData?.status === 2) {
    //         animationFrame = requestAnimationFrame(animateDots);
    //     }

    //     return () => cancelAnimationFrame(animationFrame);
    // }, [hotAirData?.status]);

    // const linePoints = trajectoryPoints.flatMap((p) => [p.x, parentRef.current?.clientHeight - p.y]);
    // const filledPolygon = [
    //     0, parentRef.current?.clientHeight || 0,
    //     ...linePoints,
    //     trajectoryPoints.length ? trajectoryPoints.at(-1).x : 0, parentRef.current?.clientHeight || 0,
    // ];
    // // console.log("changeBg?.image hai", changeBg?.image)
//     return (
//         <div ref={parentRef} className="h-full relative border-[0.2px] overflow-hidden border-gray rounded-2xl">
//             {isModalOpen && <div className="absolute top-[30%] -left-5 xsm:left-[30%] xl:left-[40%] z-40 p-6 w-96 flex flex-col items-center justify-center">
//                 {hotAirData?.status == 2 ? (
//                     <div className={`sm:-ml-28 [text-shadow:_0_4px_8px_rgb(99_102_241_/_0.8)]
//                            text-white leading-snug
//                            font-manrope font-extrabold w-full text-${(changeBg?.image === "3"||changeBg?.image === "5")?"yellow":"white"} text-center -mt-10 flex flex-col justify-start text-[2rem] sm:text-[3rem]`}>
//                         Flew away! <br />
//                         <span className={`[text-shadow:_0_4px_8px_rgb(99_102_241_/_0.8)] leading-snug
//                            font-manrope w-full font-extrabold text-[#F85050] text-${(changeBg?.image === "3"||changeBg?.image === "5")?"yellow":"white"}  text-[3rem] sm:text-[5rem]`}>{hotAirData?.timer}x</span>
//                     </div>
//                 ) : (
//                     <div className="flex flex-col -mt-32 sm:-ml-28 xsm:pl-0 items-center justify-center h-full">
//                         <img src={fan_aviator} className="w-48 h-48 xsm:w-64 xsm:h-64" alt="Logo" />
//                         <p className={`[text-shadow:_0_4px_8px_rgb(99_102_241_/_0.8)]
//                            text-white leading-snug
//                            font-manrope font-extrabold  text-${(changeBg?.image === "3"||changeBg?.image === "5")?"yellow":"white"} -mt-12 text-nowrap font-bold text-center text-[1.5rem] sm:text-[3rem] w-full`}>Waiting for next round {hotAirData?.betTime}</p>

//                         <ProgressBarIndicator timer={100} />

//                     </div>

//                 )}
//             </div>}
//             <Stage width={parentRef.current?.clientWidth || 800} height={parentRef.current?.clientHeight || 600} className="absolute bottom-4 xsm:bottom-8 left-4 xsm:left-8 z-40">

//                 <Layer>
//                     {!isPathRemoved && <Line points={filledPolygon} fill="rgba(207, 32, 48, 0.6)" closed />}
//                     {!isPathRemoved && <Line points={linePoints} stroke="#DE003D" strokeWidth={5} />}
//                 </Layer>
//             </Stage>

//             {hotAirData?.status === 1 && (
//                 <div className={`[text-shadow:_0_4px_8px_rgb(99_102_241_/_0.8)]
//                            text-white leading-snug
//                            font-manrope font-extrabold absolute left-[40%] top-[30%] text-${(changeBg?.image === "3"||changeBg?.image === "5")?"yellow":"white"} text-[2rem] sm:text-[5rem] font-bold w-4 xsm:w-8 z-40`}>
//                     {hotAirData?.timer}x
//                 </div>
//             )}

//             {hotAirData?.status !== 2 && (
//                 <>
//                     <div className="absolute left-0 top-0 h-[calc(100%-32px)] w-4 xsm:w-8 z-40 border-r-[2px] border-[#160408] overflow-hidden">
//                         {dots.map((dot) => (
//                             <div
//                                 key={dot.id}
//                                 className="w-1 h-1 bg-green rounded-full absolute left-1 xsm:left-3"
//                                 style={{ top: `${dot.y}px` }}
//                             />
//                         ))}
//                     </div>
//                     <div className="absolute right-0 bottom-0 w-[calc(100%-32px)] h-4 xsm:h-8 z-40 border-t-[2px] border-[#160408] overflow-hidden">
//                         {dots.map((dot) => (
//                             <div
//                                 key={dot.id}
//                                 className="w-1 h-1 bg-green rounded-full absolute top-1.5 xsm:top-3"
//                                 style={{ left: `${dot.x}px` }}
//                             />
//                         ))}
//                     </div>
//                 </>
//             )}

//             <div
//                 className="absolute bottom-4 xsm:bottom-8 left-4 xsm:left-8 z-40 transition-transform duration-100"
//                 style={{
//                     transform: `translate(${aviatorX}px, ${aviatorY}px)`,
//                     opacity: isResetting ? 0 : 1,
//                 }}
//             >
//                 <img src={aviator} className="w-24 h-12 -ml-2 md:w-48 md:h-20" alt="aviator" />
//             </div>

//             {changeBg?.image === "1" ?<img className="w-full object-fill bg-center h-[100%]" src={bg_one} alt="df" /> :
//                 changeBg?.image === "2" ?
//                     <img className="w-full object-fill bg-center h-[100%]" src={bg_two} alt="df" /> :
//                     changeBg?.image === "3"?
//                         <img className="w-full object-fill bg-center h-[100%]" src={bg_three} alt="df" /> :
//                         changeBg?.image === "4" ?
//                         <img className="w-full object-fill bg-center h-[100%]" src={bg_four} alt="df" /> :
//                             changeBg?.image === "5" ?
//                             <img className="w-full object-fill bg-center h-[100%]" src={bg_five} alt="df" /> :
//                                 <div
//                                     className={` absolute object-fill left-0 -bottom-[58rem] xsm:-bottom-[59rem] sm:-bottom-[88rem] lg:-bottom-[78rem] 3xl:-bottom-[91rem] w-[320%] md:w-[320%] -ml-[160%] h-[740%] xs1:h-[660%] xs:h-[600%] xsm:h-[420%] sm:h-[390%] md:h-[510%] lg:h-[520%] xl:h-[480%] 2xl:h-[520%]`}
//                                     style={{
//                                         backgroundImage: `url(${chakra})`,
//                                         backgroundPosition: "center",
//                                         backgroundSize: "cover ",
//                                         backgroundRepeat: "no-repeat",
//                                         animation: hotAirData?.status === 1 ? "spin 15s linear infinite" : "none",
//                                     }}
//                                 ></div>
//             }
//         </div>
//     );
// }

// export default AviatorFlight;

/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import aviator from "../../assets/usaAsset/aviator/aviator.gif";
import flyBoy from "../../assets/usaAsset/aviator/fly-boy.gif";
import goldenEagle from "../../assets/usaAsset/aviator/eagle-gold.png";
import blackEgale from "../../assets/usaAsset/aviator/black-eagle.png";
import blackEgaleFly from "../../assets/usaAsset/aviator/black-fly-eagle.gif";
import aviator1 from "../../assets/usaAsset/aviator/kite-ani.gif";
import fan_aviator from "../../assets/usaAsset/aviator/fan_aviator.gif";
import standingboy from "../../assets/usaAsset/aviator/standing-boy.gif";
import chakra from "../../assets/usaAsset/aviator/chakra.png";
import { socket } from "./AviatorSocket";
import ProgressBarIndicator from "./ProgressBarIndicator";
import bg_one from '../../assets/usaAsset/aviator/bg_one.png';
import bg_two from '../../assets/usaAsset/aviator/bg_two.png';
import bg_three from '../../assets/usaAsset/aviator/bg_three.png';
import bg_four from '../../assets/usaAsset/aviator/bg_four.png';
import bg_five from '../../assets/usaAsset/aviator/bg_five.png';

function AviatorFlight({ changeBg, setChangeBg, isSoundOn, setIsSoundOn, isPathRemoved, setIsPathRemoved }) {
  // const audioRef = useRef(null);
  const [leftAviatorX, setLeftAviatorX] = useState(0);
  const [leftAviatorY, setLeftAviatorY] = useState(0);
  const [rightAviatorX, setRightAviatorX] = useState(0);
  const [rightAviatorY, setRightAviatorY] = useState(0);
  const [aviatorStartX, setAviatorStartX] = useState(0);
  const [aviatorStartY, setAviatorStartY] = useState(0);
  const status2StartTimeRef = useRef(null);
  const [blackTargetX, setBlackTargetX] = useState(0);
  const [blackTargetY, setBlackTargetY] = useState(0);
  const aviator1Ref = useRef(null); // kite
  const rightAviatorRef = useRef(null); // black eagle
const [flipEagle, setFlipEagle] = useState(false);



  const [isOscillating, setIsOscillating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aviatorX, setAviatorX] = useState(0);
  const [aviatorY, setAviatorY] = useState(0);
  const [trajectoryPoints, setTrajectoryPoints] = useState([]);
  const parentRef = useRef(null);
  const [dots, setDots] = useState([]);
  let oscillationStartY = 0;
  const [hotAirData, setHotAirData] = useState(null);
  useEffect(() => {
    const handleSocket = (hotair) => {
      const q = JSON.parse(hotair);
      setHotAirData(q);
    };

    socket.on("rootspinity_aviators", handleSocket);
    return () => socket.off("rootspinity_aviators", handleSocket);
  }, []);
  // console.log("hotAirData",hotAirData)

  // useEffect(() => {
  //     if (audioRef.current) {
  //         if (isSoundOn) {
  //             audioRef.current.play().catch(error => console.error("Audio play error:", error));
  //         } else {
  //             audioRef.current.pause();
  //             audioRef.current.currentTime = 0; // Reset to start when toggled on again
  //         }
  //     }
  // }, [isSoundOn]);

  useEffect(() => {
    const img = localStorage.getItem("aviatorBg");
    if (img) {
      // console.log("bgimage",img)
      setChangeBg({ modal: false, selectBg: false, image: img });
    }
  }, [changeBg?.selectBg]);

  useEffect(() => {
    if (hotAirData?.status === 0) {
      // setIsSoundOn(false)
      setIsResetting(true); // Hide aviator before resetting
      setLeftAviatorX(-1000); // ✅ hide left aviator too
      setLeftAviatorY(-1000);

      setTimeout(() => {
        setAviatorX(0);
        setAviatorY(0);
        setLeftAviatorX(0); // ✅ reset left aviator to origin
        setLeftAviatorY(0);
        setTrajectoryPoints([]);
        setIsResetting(false);
        setIsModalOpen(true);
      }, 50); // Short delay to ensure the transition is not visible
    }
    if (hotAirData?.status === 1) setIsSoundOn(true);

    if (hotAirData?.status === 2) {
      setAviatorStartX(aviatorX);
      setAviatorStartY(aviatorY);
    }
    if (hotAirData?.status === 2) {
      status2StartTimeRef.current = performance.now(); // ✅ capture exact start time
      setAviatorStartX(aviatorX);
      setAviatorStartY(aviatorY);
    }
  }, [hotAirData?.status]);

  useEffect(() => {
    let animationFrame;
    let startTime = performance.now();
    let duration = 7000;
    let parentWidth = 800,
      parentHeight = 600;
    let oscillationFactor = 0;

    function updateDimensions() {
      if (parentRef.current) {
        parentWidth = parentRef.current.clientWidth;
        parentHeight = parentRef.current.clientHeight;
      }
    }

    function animate(time) {
      updateDimensions();
      let elapsed = time - startTime;

      if (hotAirData?.status === 0) {
        if (hotAirData?.status === 0) {
          setIsResetting(true); // Hide aviator before resetting
          setAviatorX(-1000); // Move it far outside the screen
          setAviatorY(-1000);

          setTimeout(() => {
            setAviatorX(0);
            setAviatorY(0);
            setTrajectoryPoints([]);
            setIsResetting(false); // Show aviator after reset
            setIsModalOpen(true);
          }, 50); // Short delay to ensure the transition is not visible
        }
        setIsModalOpen(true);
      } else if (hotAirData?.status === 1) {
        const screenWidth = window.innerWidth;
        setIsModalOpen(false);
        let progress = Math.min(elapsed / duration, 1);
        let curveY = Math.pow(progress, 2.5) * 0.66 * parentHeight;
        let curveX = progress * 0.65 * parentWidth;
        if (screenWidth < 640) {
          curveY = Math.pow(progress, 2.5) * 0.55 * parentHeight;
          curveX = progress * 0.65 * parentWidth;
        } else {
          curveY = Math.pow(progress, 2.5) * 0.55 * parentHeight;
          curveX = progress * 0.55 * parentWidth;
        }

        if (progress < 1) {
          setAviatorX(curveX);
          setAviatorY(-curveY);
          setTrajectoryPoints((prev) => [...prev, { x: curveX, y: curveY }]);
          oscillationStartY = -curveY;
        } else {
          if (!isOscillating) {
            setIsOscillating(true);
          }
          oscillationFactor = Math.sin(time / 200) * 0.5;
          setAviatorY((prevY) => prevY + oscillationFactor);
          setTrajectoryPoints((prev) =>
            prev.map((p) => ({
              x: p.x,
              y: p.y + oscillationFactor * (p.y / oscillationStartY),
            }))
          );
          // setAviatorY(oscillationY);
        }
      } else if (hotAirData?.status === 2) {
        setIsOscillating(false);
        console.log("🛫 Aviator1 flew away");
        // let flyProgress = Math.min(elapsed / 8000, 1);
        let delay = 1200; // 2 seconds delay
        let flyProgress = Math.min(Math.max((elapsed - delay) / 1000, 0), 1);

        let flyX = aviatorX + flyProgress * 2.5 * parentWidth; // Adjust X movement
        let flyY = aviatorY - flyProgress * 1.5 * parentHeight; // Adjust Y movement
        setAviatorX(flyX);
        setAviatorY(flyY);
        
            setTimeout(() => {
              setTrajectoryPoints([]);
            }, 1000); 
            
        // 🦅 Left aviator matches main aviator during flight for collision
        const COLLISION_DELAY = 500;
        const COLLISION_DURATION = 1000;
        let elapsedSinceStatus2 = time - (startTime + COLLISION_DELAY);

        if (elapsedSinceStatus2 < COLLISION_DURATION) {
          const glideProgress = Math.min(
            elapsedSinceStatus2 / COLLISION_DURATION,
            1
          );

          const startX = 0;
          const startY = 0;
          const targetX = aviatorX;
          const targetY = aviatorY;

          const interpolatedX = startX + glideProgress * (targetX - startX);
          const interpolatedY = startY + glideProgress * (targetY - startY);

          setLeftAviatorX(interpolatedX);
          setLeftAviatorY(interpolatedY);
        } else {
          // 🟡 Follow kite continuously during flight
          setLeftAviatorX(aviatorX);
          setLeftAviatorY(aviatorY);
        }

        // 🦅 Right aviator matches main aviator during flight for collision
        const COLLISION_DELAY_RIGHT = 500;
        const COLLISION_DURATION_RIGHT = 800;
        let elapsedSinceRightCollision =
          time - (startTime + COLLISION_DELAY_RIGHT);

        if (elapsedSinceRightCollision < COLLISION_DURATION_RIGHT) {
          const glideProgress = Math.min(
            elapsedSinceRightCollision / COLLISION_DURATION_RIGHT,
            1
          );

          const startX = 0; // Start from right
          const startY = 0;
          const targetX = aviatorX;
          const targetY = aviatorY;

          const interpolatedX = startX - glideProgress * (targetX + startX);
          const interpolatedY = startY + glideProgress * (targetY - startY);
          setRightAviatorX(interpolatedX);
          setRightAviatorY(interpolatedY);
        } else {
          // 🛑 Lock eagle's position to the kite
          setRightAviatorX(-aviatorX);
          setRightAviatorY(aviatorY);
        }

        // setLeftAviatorX(flyX);
        // setLeftAviatorY(-flyY);
        if (!isModalOpen) {
          setIsModalOpen(true); // Ensure it is set only once
        }
      }
      animationFrame = requestAnimationFrame(animate);
    }

    if (hotAirData?.status > 0) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [hotAirData?.status]);
  useEffect(() => {
    let animationFrame;
    const dotSpeed = 1;
    const dotSpacing = 50;
    // const containerHeight = parentRef.current?.clientHeight || 600;
    function initializeDots() {
      let dotsArray = [];
      let parentWidth = parentRef.current?.clientWidth || 800;
      let parentHeight = parentRef.current?.clientHeight || 600;

      for (let i = 0; i < Math.ceil(parentWidth / dotSpacing); i++) {
        for (let j = 0; j < Math.ceil(parentHeight / dotSpacing); j++) {
          dotsArray.push({
            id: `${i}-${j}`,
            x: i * dotSpacing,
            y: j * dotSpacing,
          });
        }
      }
      return dotsArray;
    }
    function animateDots() {
      setDots((prevDots) =>
        prevDots.map((dot) => ({
          id: dot.id,
          x:
            dot.x + dotSpeed < parentRef.current?.clientWidth
              ? dot.x + dotSpeed
              : 0,
          y:
            dot.y + dotSpeed < parentRef.current?.clientHeight
              ? dot.y + dotSpeed
              : 0,
        }))
      );
      animationFrame = requestAnimationFrame(animateDots);
    }
    if (
      (hotAirData?.status === 1 || hotAirData?.status === 2) &&
      dots.length === 0
    ) {
      setDots(initializeDots());
    }

    if (hotAirData?.status === 1 || hotAirData?.status === 2) {
      animationFrame = requestAnimationFrame(animateDots);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [hotAirData?.status]);

  const linePoints = trajectoryPoints.flatMap((p) => [
    p.x,
    parentRef.current?.clientHeight - p.y,
  ]);
  const filledPolygon = [
    0,
    parentRef.current?.clientHeight || 0,
    ...linePoints,
    trajectoryPoints.length ? trajectoryPoints.at(-1).x : 0,
    parentRef.current?.clientHeight || 0,
  ];
  // console.log("changeBg?.image hai", changeBg?.image)
  // console.log("changeBg?.image hai", changeBg?.image)

  // const logCountRef = useRef(0);
  // const lastRoundRef = useRef(null);

  // useEffect(() => {
  //   if (hotAirData?.status === 2) {
  //     // Detect round change and reset counter
  //     if (hotAirData?.timer !== lastRoundRef.current) {
  //       logCountRef.current = 0;
  //       lastRoundRef.current = hotAirData?.timer;
  //     }

  //     if (logCountRef.current < 1) {
  //       console.log(
  //         🛫 Aviator1 [Round ${hotAirData?.timer}] #${logCountRef.current + 1}:,
  //         {
  //           x: aviatorX,
  //           y: aviatorY,
  //         }
  //       );
  //       logCountRef.current += 1;
  //     }
  //   }
  // }, [hotAirData?.status, aviatorX, aviatorY, hotAirData?.timer]);

  const lastCollisionRef = useRef(null);
  const logCountRef = useRef(0);
  const lastRoundRef = useRef(null);

  // useEffect(() => {
  //   if (hotAirData?.status === 2) {
  //     // Detect round change and reset counter
  //     if (hotAirData?.timer !== lastRoundRef.current) {
  //       logCountRef.current = 0;
  //       lastRoundRef.current = hotAirData?.timer;
  //     }

  //     if (logCountRef.current < 3) {
  //       console.log(
  //         🛫 Aviator1 [Round ${hotAirData?.timer}] #${logCountRef.current + 1}:,
  //         {
  //           x: aviatorX,
  //           y: aviatorY,
  //         }
  //       );
  //       logCountRef.current += 1;
  //     }
  //   }
  // }, [hotAirData?.status, aviatorX, aviatorY, hotAirData?.timer]);

  useEffect(() => {
    if (hotAirData?.status === 2) {
      if (hotAirData?.timer !== lastRoundRef.current) {
        logCountRef.current = 0;
        lastRoundRef.current = hotAirData?.timer;
      }

      if (logCountRef.current < 3) {
        console.log(
          `
        🛫 Main Aviator [Round ${hotAirData?.timer}] #${
            logCountRef.current + 1
          }:`,
          { x: aviatorX, y: aviatorY }
        );
        console.log(
          ` 🦅 Left Aviator [Round ${hotAirData?.timer}] #${
            logCountRef.current + 1
          }:`,
          { x: leftAviatorX, y: leftAviatorY }
        );
        logCountRef.current += 1;
      }
    }
  }, [
    hotAirData?.status,
    aviatorX,
    aviatorY,
    leftAviatorX,
    leftAviatorY,
    hotAirData?.timer,
  ]);

  // Position offsets to align eagle over kite container
  const aviatorOffsetX = 25; // Approx left-4 = 16px + internal offset
  const aviatorOffsetY = parentRef.current?.clientHeight
    ? parentRef.current.clientHeight - 200 // adjust as needed for better alignment
    : 120;

  const rightAviatorOffsetX = 55; // Move leftward
  const rightAviatorOffsetY = parentRef.current?.clientHeight
    ? parentRef.current.clientHeight - 200
    : 120;

  // useEffect(() => {
  //   if (hotAirData?.status === 2) {
  //     status2StartTimeRef.current = performance.now();
  //     setBlackTargetX(aviatorX); // freeze kite X
  //     setBlackTargetY(aviatorY); // freeze kite Y
  //   }
  // }, [hotAirData?.status]);

  useEffect(() => {
    let timer;
    if (hotAirData?.status === 2) {
      timer = setTimeout(() => {
        setFlipEagle(true);
      }, 500);
    } else {
      setFlipEagle(false); // reset on other statuses
    }
    return () => clearTimeout(timer);
  }, [hotAirData?.status]);

  const [isGoldenEagleActive, setIsGoldenEagleActive] = useState(false);
  useEffect(() => {
    if (hotAirData?.status === 3) {
      // ✅ Set in localStorage
      localStorage.setItem("goldenEagleActive", "true");
      setIsGoldenEagleActive(true);

      // ✅ Remove after 1 second
      const timer = setTimeout(() => {
        localStorage.removeItem("goldenEagleActive");
        setIsGoldenEagleActive(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [hotAirData?.status]);

  return (
    <div
      ref={parentRef}
      className="h-full relative border-[0.2px] overflow-hidden border-gray rounded-2xl"
    >
      {/* Top-left aviator */}
      {/* <img
  src={aviator}
  alt="Top Left Aviator"
  className="absolute top-2 left-2 w-12 h-12 sm:w-20 sm:h-20 z-50"
/> */}
      <img
        src={goldenEagle}
        alt="Left Aviator"
        className="absolute top-12 left-22 w-12 h-12 sm:w-20 sm:h-20 z-50  transition-transform duration-300"
        // style={{
        //   transform: `translate(${leftAviatorX}px, ${leftAviatorY}px)`,
        // }}
        // style={{
        //   transform:
        //     hotAirData?.status === 2
        //       ? `translate(${leftAviatorX + aviatorOffsetX}px, ${
        //           leftAviatorY + aviatorOffsetY
        //         }px)`
        //       : `translate(0px, 0px)`, // ✅ top-left by default
        // }}
      />
      {/* Top-right aviator */}
      {hotAirData?.status != 2 && (
        <img
          src={blackEgale}
          alt="Top Right Aviator"
          // className="absolute top-2 right-2 w-12 h-12 sm:w-20 sm:h-20 z-50"
          className="absolute top-8 right-2 w-12 h-12 sm:w-20 sm:h-20 z-50 transition-transform duration-300"
          // style={{
          //   transform:
          //     hotAirData?.status === 2
          //       ? `translate(${rightAviatorX - rightAviatorOffsetX}px, ${
          //           rightAviatorY + rightAviatorOffsetY
          //         }px)`
          //       : `translate(0px, 0px)`,
          // }}
        />
      )}

      {isModalOpen && (
        <div
          className="absolute top-[30%] left-1/2 transform -translate-x-1/2
               w-full px-4 z-40 flex flex-col items-center justify-center"
        >
          {hotAirData?.status == 2 ? (
            <div
              className={`[text-shadow:_0_4px_8px_rgb(99_102_241_/_0.8)]
                    text-white leading-snug font-manrope font-extrabold
                    text-${
                      changeBg?.image === "3" || changeBg?.image === "5"
                        ? "yellow"
                        : "white"
                    }
                    text-center -mt-10 flex flex-col justify-start text-[2rem] sm:text-[3rem]`}
            >
              Flew away! <br />
              <span
                className={`[text-shadow:_0_4px_8px_rgb(99_102_241_/_0.8)]
                      leading-snug font-manrope font-extrabold text-[#F85050]
                      text-${
                        changeBg?.image === "3" || changeBg?.image === "5"
                          ? "yellow"
                          : "white"
                      } text-[3rem] sm:text-[5rem]`}
              >
                {hotAirData?.timer}x
              </span>
            </div>
          ) : (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-40">
              <div className="w-48 h-48 xsm:w-64 xsm:h-64 flex items-center justify-center text-white font-bold text-[6rem] xsm:text-[8rem] leading-none">
                {hotAirData?.betTime}
              </div>

              <p
                className={`[text-shadow:_0_4px_8px_rgb(99_102_241_/_0.8)]
      text-white leading-snug font-manrope font-extrabold
      text-${
        changeBg?.image === "3" || changeBg?.image === "5" ? "yellow" : "white"
      }
      -mt-12 text-center font-bold text-[1.5rem] sm:text-[3rem] w-full whitespace-nowrap`}
              >
                Waiting for next round
              </p>

              <div className="mt-2 w-80 sm:w-100">
                <ProgressBarIndicator timer={100} />
              </div>
            </div>
          )}
        </div>
      )}

      <Stage
        width={parentRef.current?.clientWidth || 800}
        height={parentRef.current?.clientHeight || 600}
        // className="absolute bottom-4 xsm:bottom-8 left-4 xsm:left-8 z-40"
        className="absolute bottom-[40px] xs:bottom-[58px] xsm:bottom-[92px] left-12 xsm:left-14 z-50 "
      >
        <Layer>
          {!isPathRemoved && (
            <Line
              points={filledPolygon}
              // fill="rgba(207, 32, 48, 0.6)"
              closed
            />
          )}
          {!isPathRemoved && (
            <Line points={linePoints} stroke="#D048A0" strokeWidth={2} />
          )}
        </Layer>
      </Stage>

      {hotAirData?.status === 1 && (
        <div
          className={`[text-shadow:_0_4px_8px_rgb(99_102_241_/_0.8)]
                           text-white leading-snug
                           font-manrope font-extrabold absolute left-[40%] top-[30%] text-${
                             changeBg?.image === "3" || changeBg?.image === "5"
                               ? "yellow"
                               : "white"
                           } text-[2rem] sm:text-[5rem] font-bold w-4 xsm:w-8 z-40`}
        >
          {hotAirData?.timer}x
        </div>
      )}
      {/* 
      {hotAirData?.status !== 2 && (
        <>
          <div className="absolute left-0 top-0 h-[calc(100%-32px)] w-4 xsm:w-8 z-40 border-r-[2px] border-[#160408] overflow-hidden">
            {dots.map((dot) => (
              <div
                key={dot.id}
                className="w-1 h-1 bg-green rounded-full absolute left-1 xsm:left-3"
                style={{ top: ${dot.y}px }}
              />
            ))}
          </div>
          <div className="absolute right-0 bottom-0 w-[calc(100%-32px)] h-4 xsm:h-8 z-40 border-t-[2px] border-[#160408] overflow-hidden">
            {dots.map((dot) => (
              <div
                key={dot.id}
                className="w-1 h-1 bg-green rounded-full absolute top-1.5 xsm:top-3"
                style={{ left: ${dot.x}px }}
              />
            ))}
          </div>
        </>
      )} */}

      <div className="absolute bottom-4 xsm:bottom-8 left-4 xsm:left-8 z-40 ">
        {hotAirData?.status === 1 ? (
          <img
            src={flyBoy}
            // className="relative -bottom-2 -left-10 w-40 h-44 z-40"
            className="relative -bottom-2 -left-10 xsm:-left-14 xsm:w-36 xsm:h-44 z-10 xs:w-32 xs:h-32 w-32 h-20"
            alt="flyboy"
          />
        ) : hotAirData?.status === 2 ? (
          <img
            src={flyBoy}
            // className="relative -!bottom-2 -left-10 w-40 h-44 z-10"
            className="relative -bottom-2 -left-10 xsm:-left-14 xsm:w-36 xsm:h-44 z-10 xs:w-34 xs:h-32 w-32 h-20"
            alt="standingboy"
          />
        ) : null}
        {hotAirData?.status == 0 ? (
          <>
            {" "}
            <img
              src={standingboy}
              className="relative -bottom-2 xsm:-left-14 xs:-left-8 -left-10 xsm:w-36 xsm:h-44 z-10 xs:w-34 xs:h-32 w-32 h-20"
              alt="standingboy"
            />
          </>
        ) : null}
        {/* kite */}
        {/* {(hotAirData?.status === 1 || hotAirData?.status === 2) && (
          <img
            src={aviator1}
            className="w-8 h-8 -ml-2 md:w-28 md:h-12 !bottom-10 relative"
            alt="aviator"
            style={{
              transform: `translate(${aviatorX}px, ${aviatorY}px)`,
              opacity: isResetting ? 0 : 1,
            }}
          />
        )} */}

        {/* {hotAirData?.status === 2 && (
          <img
            src={blackEgaleFly}
            className="w-10 h-16 -ml-2 md:w-40 md:h-32 !bottom-10 relative -mt-16"
            alt="black-eagle"
            style={{
              transform: `translate(${aviatorX}px, ${aviatorY}px)`,
              opacity: isResetting ? 0 : 1,
              position: "absolute", // helps ensure it's on top
              pointerEvents: "none", // optional: prevent interference
            }}
          />
        )} */}
        {(hotAirData?.status === 1 || hotAirData?.status === 2) && (
          <img
            src={aviator1}
            className="w-12 h-12 z-20 xsm:w-20 xsm:h-16 -ml-16 xsm:-ml-10 left-20 xsm:left-0 md:w-24 md:h-16 xs:!bottom-5 relative -bottom-1"
            alt="aviator"
            style={{
              transform: `translate(${aviatorX}px, ${aviatorY}px)`,
              opacity: isResetting ? 0 : 1,
              position: "absolute",
              transition: "transform 0.05s linear", // ensure smooth movement
            }}
          />
        )}

        {hotAirData?.status === 2 && (
          <img
            src={blackEgaleFly}
            className="w-24 h-20 xsm:w-32 xsm:h-28 -ml-4 xs:-ml-4 xsm:-ml-16 md:w-40 md:h-32 xs:!bottom-5 relative -mt-16 z-40 -bottom-2"
            alt="black-eagle"
            style={{
              transform: `translate(${aviatorX}px, ${aviatorY}px) scaleX(${
                flipEagle ? -1 : 1
              })`,
              opacity: isResetting ? 0 : 1,
              position: "absolute",
              pointerEvents: "none",
              transition: "transform 0.05s linear", // match the aviator movement
            }}
          />
        )}
        {isGoldenEagleActive && (
          <img
            src={goldenEagle}
            alt="golden-eagle"
            className="w-10 h-10 xsm:w-32 xsm:h-28 -ml-4 xs:-ml-6 xsm:-ml-16 md:w-20 md:h-20 xs:!bottom-8 relative -mt-16 z-40 -bottom-2"
            style={{
              transform: `translate(${aviatorX}px, ${aviatorY}px) scaleX(${
                flipEagle ? -1 : 1
              })`,
              transformOrigin: "center",
              opacity: isResetting ? 0 : 1,
              position: "absolute",
              pointerEvents: "none",
              transition: "transform 0.05s linear",
            }}
          />
        )}
      </div>

      {["1", "2", "3", "4", "5"].includes(changeBg?.image) ? (
        <img
          className="w-full object-fill bg-center h-[100%]"
          src={
            changeBg?.image === "1"
              ? bg_one
              : changeBg?.image === "2"
              ? bg_two
              : changeBg?.image === "3"
              ? bg_three
              : changeBg?.image === "4"
              ? bg_four
              : bg_five
          }
          alt="background"
        />
      ) : (
        <img
          className="w-full object-fill bg-center h-[100%]"
          src={bg_two} // ✅ default to bg_two when not 1–5
          alt="background"
        />
      )}
    </div>
  );
}

export default AviatorFlight;

