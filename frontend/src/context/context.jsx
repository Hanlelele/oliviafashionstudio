import { useContext, createContext, useState, useEffect, useRef } from "react";
import { Men, Women, Kid, Baby, Accessories } from "../assets/imgs";
const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);
export const UserContextProvider = ({ children }) => {
  //Category menu context
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const handleDocumentClick = (event) => {
    if (
      categoryDropdownRef.current &&
      !categoryDropdownRef.current.contains(event.target)
    ) {
      setCategoryOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  return (
    <UserContext.Provider
      value={{
        isCategoryOpen,
        setCategoryOpen,
        categoryDropdownRef,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
