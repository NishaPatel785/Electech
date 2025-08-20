import React from "react";

const RandomNumber = () => {
    const [number, setNumber] = React.useState(0);
    
    // add side effect to component
    React.useEffect(() => {
      // create interval
      const interval = setInterval(
        // set number every 5s
        () => setNumber(Math.floor(Math.random() * 100 + 1)),
        2000
      );
  
      // clean up interval on unmount
      return () => {
        clearInterval(interval);
      };
    }, []);
  
    return <span>{number}</span>;
  };
export default RandomNumber;  