import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // or any icon you like
import classes from  "./TopButton.module.css"; // we'll style it here

const TopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button className={classes.top_button} onClick={scrollToTop}>
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default TopButton;
