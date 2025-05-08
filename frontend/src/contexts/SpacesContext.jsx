import { createContext, useContext, useState } from "react";

const SpaceContext = createContext();

export const SpaceProvider = ({ children }) => {
  const [selectedSpace, setSelectedSpace] = useState(null);

  return (
    <SpaceContext.Provider value={{ selectedSpace, setSelectedSpace }}>
      {children}
    </SpaceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSpace = () => useContext(SpaceContext);