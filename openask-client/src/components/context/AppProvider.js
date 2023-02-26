import React, { useState, useEffect } from "react";
import AppContext from "./AppContext";

const AppProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const storedData = localStorage.getItem("openAskUserData");
    return storedData ? JSON.parse(storedData) : { user: "none" };
  });

  useEffect(() => {
    localStorage.setItem("openAskUserData", JSON.stringify(userInfo));
  }, [userInfo]);

  return (
    <AppContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
