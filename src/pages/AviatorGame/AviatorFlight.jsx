/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import aviator from "../../assets/usaAsset/aviator/aviator.gif";
import flyBoy from "../../assets/usaAsset/aviator/fly-boy.gif";
import goldenEagle from "../../assets/usaAsset/aviator/eagle-gold.png";
import blackEgale from "../../assets/usaAsset/aviator/black-eagle.png";
import blackEgaleFly from "../../assets/usaAsset/aviator/black-fly-eagle.gif";
import goldenEagleFly from "../../assets/usaAsset/aviator/Golden_Eagle_fly.gif";
import aviator1 from "../../assets/usaAsset/aviator/kite-ani.gif";
import fan_aviator from "../../assets/usaAsset/aviator/fan_aviator.gif";
import standingboy from "../../assets/usaAsset/aviator/standing-boy.gif";
import chakra from "../../assets/usaAsset/aviator/chakra.png";
import { socket } from "./AviatorSocket";
import ProgressBarIndicator from "./ProgressBarIndicator";
import bg_one from "../../assets/usaAsset/aviator/bg_one.png";
import bg_two from "../../assets/usaAsset/aviator/bg_two.png";
import bg_three from "../../assets/usaAsset/aviator/bg_three.png";
import bg_four from "../../assets/usaAsset/aviator/bg_four.png";
import bg_five from "../../assets/usaAsset/aviator/bg_five.png";
import right_TREE from "../../assets/usaAsset/aviator/right-TREE.png";
import left_tree from "../../assets/usaAsset/aviator/left-tree.png";

function AviatorFlight({
  changeBg,
  setChangeBg,
  isSoundOn,
  setIsSoundOn,
  isPathRemoved,
  setIsPathRemoved,
}) {
  // const audioRef = useRef(null);
  const [leftAviatorX, setLeftAviatorX] = useState(0);
  const [leftAviatorY, setLeftAviatorY] = useState(0);
  const [rightAviatorX, setRightAviatorX] = useState(0);
  const [rightAviatorY, setRightAviatorY] = useState(0);
  const [aviatorStartX, setAviatorStartX] = useState(0);
  const [aviatorStartY, setAviatorStartY] = useState(0);
  const status2StartTimeRef = useRef(null);
  const status1StartTimeRef = useRef(null);
  const status3StartTimeRef = useRef(null);

  const [blackTargetX, setBlackTargetX] = useState(0);
  const [blackTargetY, setBlackTargetY] = useState(0);
  const aviator1Ref = useRef(null); // kite
  const rightAviatorRef = useRef(null); // black eagle
  const [flipEagle, setFlipEagle] = useState(false);
  const flightHandledRef = useRef(false);

  const [isOscillating, setIsOscillating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aviatorX, setAviatorX] = useState(0);
  const [aviatorY, setAviatorY] = useState(0);
  const [trajectoryPoints, setTrajectoryPoints] = useState([]);
  const [status1Trajectory, setStatus1Trajectory] = useState([]);
  const [status3Trajectory, setStatus3Trajectory] = useState([]);
  const [status3StartTime, setStatus3StartTime] = useState(null);
  const [status1EndPosition, setStatus1EndPosition] = useState({
    x: 0,
    y: 0,
    progress: 0,
  });

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

      if (hotAirData?.status === 0) {
        localStorage.removeItem("kitePosition");
        localStorage.removeItem("kitePath");
        localStorage.removeItem("kiteStartTime");
        setStatus1EndPosition({ x: 0, y: 0, progress: 0 });
        setStatus3StartTime(null);
      }

      setTimeout(() => {
        setAviatorX(0);
        setAviatorY(0);
        setLeftAviatorX(0); // ✅ reset left aviator to origin
        setLeftAviatorY(0);
        setTrajectoryPoints([]);
        setStatus3Trajectory([]); // ✅ Reset status 3 trajectory
        setIsResetting(false);
        setIsModalOpen(true);
      }, 50); // Short delay to ensure the transition is not visible
    }
    if (hotAirData?.status === 1) {
      status1StartTimeRef.current = performance.now();
      setIsSoundOn(true);
    }

    if (hotAirData?.status === 2) {
      setAviatorStartX(aviatorX);
      setAviatorStartY(aviatorY);
      status2StartTimeRef.current = performance.now(); // ✅ capture exact start tim
    }
    if (hotAirData?.status === 3 && !status3StartTimeRef.current) {
      status3StartTimeRef.current = performance.now();

      // Only if we have a valid end position from status 1
      if (status1EndPosition.x !== 0 || status1EndPosition.y !== 0) {
        setAviatorX(status1EndPosition.x);
        setAviatorY(status1EndPosition.y);

        // Start trajectory with just the last point from status 1
        setStatus1Trajectory((prev) => {
          // If we have previous points, take just the last one
          // If not, start fresh with current position
          return prev.length > 0
            ? [prev[prev.length - 1]]
            : [{ x: status1EndPosition.x, y: -status1EndPosition.y }];
        });
        setStatus3Trajectory([
          { x: status1EndPosition.x, y: -status1EndPosition.y },
        ]);
      }
    }
    // ✅ NEW: Handle status 3 start time
    // if (hotAirData?.status === 3 && status3StartTime === null) {
    //   status3StartTimeRef.current = performance.now(); // ✅ new start
    //   if (status1EndPosition.x !== 0 || status1EndPosition.y !== 0) {
    //     setAviatorX(status1EndPosition.x);
    //     setAviatorY(status1EndPosition.y);
    //   }
    // }
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
      let elapsed;
      if (hotAirData?.status === 1 && status1StartTimeRef.current !== null) {
        elapsed = time - status1StartTimeRef.current;
      } else if (
        hotAirData?.status === 3 &&
        status3StartTimeRef.current !== null
      ) {
        elapsed = time - status3StartTimeRef.current;
      } else {
        elapsed = 0;
      }
      updateDimensions();
      elapsed = time - startTime;

      if (hotAirData?.status === 0) {
        status1StartTimeRef.current = null;
        status3StartTimeRef.current = null;
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
        // setStatus1EndPosition({ x: curveX, y: -curveY, progress });
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
          setStatus1EndPosition({ x: curveX, y: -curveY, progress });
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
      } else if (hotAirData?.status === 3) {
        setIsModalOpen(false);

        if (status3StartTimeRef.current) {
          const status3Elapsed = time - status3StartTimeRef.current;
          const screenWidth = window.innerWidth;

          // Calculate continuation progress from where status 1 left off
          const continuationDuration = 3000; // Adjust this duration as needed
          const continuationProgress = Math.min(
            status3Elapsed / continuationDuration,
            1
          );
          // Start from status 1 end position
          const startX = status1EndPosition.x;
          const startY = status1EndPosition.y;
          // Start from status 1 end position and continue the curve
          // Calculate target position (continue the curve)
          const targetProgress =
            status1EndPosition.progress +
            (1 - status1EndPosition.progress) * continuationProgress;
          let curveY, curveX;
          if (screenWidth < 640) {
            curveY = Math.pow(targetProgress, 2.5) * 0.55 * parentHeight;
            curveX = targetProgress * 0.65 * parentWidth;
          } else {
            curveY = Math.pow(targetProgress, 2.5) * 0.55 * parentHeight;
            curveX = targetProgress * 0.55 * parentWidth;
          }
          // Interpolate between start and target positions
          const currentX = startX + (curveX - startX) * continuationProgress;
          const currentY = startY + (-curveY - startY) * continuationProgress;
          setAviatorX(currentX);
          setAviatorY(currentY);

          // Continue adding to trajectory points
          // Update trajectory points
          setStatus3Trajectory((prev) => {
            const newPoint = { x: currentX, y: -currentY };
            // Only add if significantly different from last point
            if (
              prev.length === 0 ||
              Math.abs(prev[prev.length - 1].x - newPoint.x) > 1 ||
              Math.abs(prev[prev.length - 1].y - newPoint.y) > 1
            ) {
              return [...prev, newPoint];
            }
            return prev;
          });

          // oscillationStartY = -curveY;

          // Add oscillation if we've reached the end of continuation
          if (continuationProgress >= 1 && !isOscillating) {
            if (!isOscillating) {
              setIsOscillating(true);
              oscillationStartY = currentY;
            }
            // oscillationFactor = Math.sin(time / 200) * 0.5;
            // setAviatorY((prevY) => prevY + oscillationFactor);
            // setTrajectoryPoints((prev) =>
            //   prev.map((p) => ({
            //     x: p.x,
            //     y: p.y + oscillationFactor * (p.y / oscillationStartY),
            //   }))
            // );
            if (continuationProgress >= 1 && !isOscillating) {
              setIsOscillating(true);
              oscillationStartY = currentY;
              oscillationFactor = Math.sin(time / 200) * 0.5;
              setAviatorY((prevY) => prevY + oscillationFactor);
              setStatus3Trajectory((prev) =>
                prev.map((p) => ({
                  x: p.x,
                  y: p.y + oscillationFactor * (p.y / oscillationStartY),
                }))
              );
            }
          }
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
          setTrajectoryPoints([]); // Clear only after some time in status 2
          setStatus3Trajectory([]); // Also clear status 3 trajectory
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
    if (hotAirData?.status === 1) {
      status1StartTimeRef.current = performance.now();
    }

    if (hotAirData?.status === 3) {
      status3StartTimeRef.current = performance.now();
      if (status1EndPosition.x !== 0 || status1EndPosition.y !== 0) {
        setAviatorX(status1EndPosition.x);
        setAviatorY(status1EndPosition.y);
      }
    }

    if ([1, 2, 3].includes(hotAirData?.status)) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [hotAirData?.status]);

  console.log("tracjhectrye0", trajectoryPoints);

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
      (hotAirData?.status === 1 ||
        hotAirData?.status === 2 ||
        hotAirData?.status === 3) &&
      dots.length === 0
    ) {
      setDots(initializeDots());
    }

    if (
      hotAirData?.status === 1 ||
      hotAirData?.status === 2 ||
      hotAirData?.status === 3
    ) {
      animationFrame = requestAnimationFrame(animateDots);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [hotAirData?.status]);

  // ✅ FIX: Combine trajectories for status 3, show connected path
  let combinedTrajectory = [];

  if (hotAirData?.status === 3) {
    // For status 3: show both status 1 trajectory + status 3 trajectory (connected)
    combinedTrajectory = [...trajectoryPoints, ...status3Trajectory];
  } else {
    // For other statuses: show normal trajectory
    combinedTrajectory = trajectoryPoints;
  }

  const linePoints = combinedTrajectory.flatMap((p) => [
    p.x,
    parentRef.current?.clientHeight - p.y,
  ]);
  console.log("linePointslinePoints", linePoints);
  const filledPolygon = [
    0,
    parentRef.current?.clientHeight || 0,
    ...linePoints,
    combinedTrajectory.length ? combinedTrajectory.at(-1).x : 0,
    parentRef.current?.clientHeight || 0,
  ];

  const lastCollisionRef = useRef(null);
  const logCountRef = useRef(0);
  const lastRoundRef = useRef(null);

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

  const [isPreFlip, setIsPreFlip] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [finalY, setFinalY] = useState(aviatorY); // store final upward position

  useEffect(() => {
    if (flipEagle) {
      // ✅ Step 1: Move upward slightly
      setIsPreFlip(true);
      setIsFlipped(false);

      // ✅ Step 2: After 150ms, keep the upward position and flip
      const timer = setTimeout(() => {
        setFinalY(aviatorY - 20); // final Y stays upward
        setIsPreFlip(false);
        setIsFlipped(true);
      }, 150);

      return () => clearTimeout(timer);
    } else {
      // reset if no flip
      setIsFlipped(false);
      setFinalY(aviatorY);
    }
  }, [flipEagle, aviatorY]);

  // ✅ During pre-flip, apply temporary upward movement
  const translateY = isPreFlip ? aviatorY - 20 : finalY;
  const scaleX = isFlipped ? -1 : 1;

  // Save kite state every time it moves (only during status 1)
  useEffect(() => {
    if (hotAirData?.status === 1 || hotAirData?.status === 3) {
      localStorage.setItem(
        "kitePosition",
        JSON.stringify({ x: aviatorX, y: aviatorY })
      );
      localStorage.setItem("kitePath", JSON.stringify(trajectoryPoints));
    }
  }, [aviatorX, aviatorY, trajectoryPoints, hotAirData?.status]);

  useEffect(() => {
    if (hotAirData?.status === 1) {
      const savedPos = JSON.parse(localStorage.getItem("kitePosition") || "{}");
      const savedPath = JSON.parse(localStorage.getItem("kitePath") || "[]");
      const savedStartTime = localStorage.getItem("kiteStartTime");

      if (savedPos?.x !== undefined) {
        setAviatorX(savedPos.x);
        setAviatorY(savedPos.y);
      }

      if (savedPath.length > 0) {
        setTrajectoryPoints(savedPath);
      }

      if (savedStartTime) {
        const elapsed = Date.now() - parseInt(savedStartTime);
        // ✅ Adjust animation startTime so animation continues seamlessly
        status2StartTimeRef.current = performance.now() - elapsed;
      }
    }
    if (hotAirData?.status === 1) {
      console.log("status 1 ");
    }
  }, [hotAirData?.status, hotAirData?.timer]);
  console.log("hotAirData?.status 3333333:", filledPolygon, linePoints);
  console.log("isPathRemoved", isPathRemoved);
  return (
    <div
      ref={parentRef}
      className="h-full relative border-[0.2px] overflow-hidden border-gray rounded-2xl"
    >
      {/* Top-left aviator */}

      {/* ✅ Left Branch Always Visible */}
      <div className="absolute top-12 left-22 z-50">
        <div className="relative w-28 sm:w-40">
          {/* Branch as the base (always visible) */}
          <img src={left_tree} alt="Branch" className="w-14 sm:w-20 h-auto" />

          {/* ✅ Golden Eagle appears only when condition is true */}
          {!isGoldenEagleActive && (
            <img
              src={goldenEagle}
              alt="Golden Eagle"
              className="absolute w-14 h-14 sm:w-24 sm:h-24 left-4 sm:left-10 transform -translate-x-1/2 -top-3 sm:-top-8"
            />
          )}
        </div>
      </div>

      {/* Top-right aviator */}
      {/* ✅ Right Branch Always Visible */}
      <div className="absolute top-14 right-0 z-50">
        <div className="relative w-28 sm:w-40">
          {/* Branch as the base */}
          <img
            src={right_TREE}
            alt="Right Branch"
            className="w-14 sm:w-28 h-auto ml-auto"
          />

          {/* ✅ Black Eagle only shows when status != 2 */}
          {hotAirData?.status != 2 && (
            <img
              src={blackEgale}
              alt="Black Eagle"
              className="absolute w-14 h-14 sm:w-24 sm:h-24 right-8 sm:right-12 transform translate-x-1/2 -top-6 sm:-top-8"
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="absolute top-[30%] left-1/2 transform -translate-x-1/2
               w-full px-4 z-40 flex flex-col items-center justify-center"
        >
          {hotAirData?.status === 2 ? (
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

              <div className="mt-2 w-80 sm:w-200">
                <ProgressBarIndicator timer={150} />
              </div>
            </div>
          )}
        </div>
      )}

      <Stage
        width={parentRef.current?.clientWidth || 800}
        height={parentRef.current?.clientHeight || 600}
        // className="absolute bottom-4 xsm:bottom-8 left-4 xsm:left-8 z-40"
        className="absolute bottom-[40px] xs:bottom-[58px] xsm:bottom-[92px] left-8 xs:left-4 xsm:left-14 z-50 "
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

      {(hotAirData?.status === 1 || hotAirData?.status === 3) && (
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

      <div className="absolute bottom-4 xsm:bottom-8 left-4 xsm:left-8 z-40 ">
        {hotAirData?.status === 1 ? (
          <img
            src={flyBoy}
            // className="relative -bottom-2 -left-10 w-40 h-44 z-40"
            className="relative -bottom-2 -left-6 xs:-left-8 xsm:-left-14 xsm:w-36 xsm:h-44 z-10 xs:w-24 xs:h-32 w-16 h-20"
            alt="flyboy"
          />
        ) : hotAirData?.status === 2 ? (
          <img
            src={flyBoy}
            // className="relative -!bottom-2 -left-10 w-40 h-44 z-10"
            className="relative -bottom-2 -left-6 xsm:-left-14 xsm:w-36 xsm:h-44 z-10 xs:w-34 xs:h-32 w-16 h-20"
            alt="standingboy"
          />
        ) : hotAirData?.status === 3 ? (
          <img
            src={flyBoy}
            // className="relative -!bottom-2 -left-10 w-40 h-44 z-10"
            className="relative -bottom-2 -left-6 xsm:-left-14 xsm:w-36 xsm:h-44 z-10 xs:w-34 xs:h-32 w-16 h-20"
            alt="standingboy"
          />
        ) : null}
        {hotAirData?.status === 0 ? (
          <>
            {" "}
            <img
              src={standingboy}
              className="relative -bottom-2 xsm:-left-14 xs:-left-6 -left-6 xsm:w-36 xsm:h-44 z-10 xs:w-34 xs:h-32 w-16 h-20"
              alt="standingboy"
            />
          </>
        ) : null}

        {(hotAirData?.status === 1 ||
          hotAirData?.status === 2 ||
          hotAirData?.status === 3) && (
          <img
            src={aviator1}
            className="w-12 h-12 z-20 xsm:w-20 xsm:h-16 -ml-16 xsm:-ml-10 left-16 xs:left-10 xsm:left-0 md:w-24 md:h-16 xs:!bottom-5 relative -bottom-1"
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
            className="w-24 h-20 xsm:w-32 xsm:h-28 -ml-2 xs:-ml-10 xsm:-ml-16 md:w-40 md:h-32 xs:!bottom-5 relative -mt-16 z-40 -bottom-2"
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
            src={goldenEagleFly}
            alt="golden-eagle"
            className="w-10 h-10 xsm:w-32 xsm:h-28 -ml-4 xs:-ml-6 xsm:-ml-10 md:w-20 md:h-20 xs:!bottom-8 relative -mt-16 z-40 -bottom-2"
            style={{
              transform: `translate(${aviatorX}px, ${translateY}px) scaleX(${scaleX})`,
              transformOrigin: "center",
              opacity: isResetting ? 0 : 1,
              position: "absolute",
              pointerEvents: "none",
              transition: "transform 0.15s ease-in-out", // smooth upward + flip
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
          src={bg_one} // ✅ default to bg_two when not 1–5
          alt="background"
        />
      )}
    </div>
  );
}

export default AviatorFlight;
