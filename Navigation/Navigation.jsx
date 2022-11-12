import { useState, useRef, useEffect, useMemo, useCallback } from "react";

import useMouseMove from "src/hooks/useMouseMove.js";
import useIsMobile from "src/hooks/useIsMobile.js";
import useWindowSize from "src/hooks/useWindowSize.js";
import data from "./data.js";

import styles from "./styles.module.css";

const Navigation = ({ activeNav, setActiveNav }) => {
  const [mouseOut, setMouseOut] = useState(false);
  const [isPressedDown, setIsPressedDown] = useState(false);
  const [touchMoveDistance, setTouchMoveDistance] = useState(0);

  const { mouseX, onMouseMove } = useMouseMove();

  const isMobile = useIsMobile();
  const isTablet = useIsMobile(992);

  const navContainerRef = useRef();
  const navTrackRef = useRef();

  const navScrollSpeed = useMemo(() => (isTablet ? 1 : 2), [isTablet]);
  const navScrollOffset = useMemo(() => (isTablet ? 50 : 200), [isTablet]);

  const touchEvent = touchMoveDistance;
  const mouseHoverEvent = mouseOut
    ? -mouseX / navScrollSpeed + navScrollOffset
    : 0;
  const handleMouseEnter = () => {
    setMouseOut(true);
  };

  const handleMouseLeave = () => {
    setMouseOut(false);
  };

  const handleNavLinks = () => {
    setActiveNav(false);
  };

  useEffect(() => {
    navContainerRef.current.addEventListener("touchstart", handleTouchStart);
  }, []);

  const handleTouchStart = (e) => {
    setIsPressedDown(true);
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.touches[0].clientX - window.pageXOffset - rect.left;
    const offsetLeft = navTrackRef.current.offsetLeft;
    const cursorXPoss = offsetX - offsetLeft;

    navContainerRef.current.addEventListener(
      "touchmove",
      handleTouchMove(e, offsetX, cursorXPoss)
    );
    navContainerRef.current.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchEnd = useCallback(() => {
    setIsPressedDown(false);
  }, []);

  const handleTouchMove = (e, offsetX, cursorXPoss) => {
    e.preventDefault();
    setTouchMoveDistance(offsetX - cursorXPoss);
  };

  useEffect(() => {
    navContainerRef.current.addEventListener("mousemove", onMouseMove);
    return () =>
      navContainerRef.current.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <nav className={styles.nav}>
      <div
        className={`${styles.navContainer} ${
          activeNav && styles.navContainerActive
        }`}
        ref={navContainerRef}
        onMouseLeave={() => handleMouseLeave()}
        onMouseEnter={() => handleMouseEnter()}
      >
        <div
          style={{
            left: `${isPressedDown ? touchEvent : mouseHoverEvent}px`,
          }}
          className={styles.navTrack}
          ref={navTrackRef}
        >
          {data.map((link, index) => (
            <div
              key={`${link.title} ${index}`}
              className={styles.navLink}
              onClick={() => handleNavLinks()}
            >
              <a href={link.path}>
                <div className={styles.linkCardContainer}>
                  <h4 className={styles.linkCardTitle}>{link.title}</h4>
                  <div className={styles.linkCardImg}></div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
