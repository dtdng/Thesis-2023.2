import React, { useEffect, useState } from "react";

const TimePicker = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return <div>{time.toLocaleTimeString()} GMT +7</div>;
};

export default TimePicker;
