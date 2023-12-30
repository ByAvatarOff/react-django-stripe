import React, { createContext, useState } from 'react';

export const ButtonContext = createContext();

export const ButtonContextProvider = (props) => {
  let flag = true ? localStorage.getItem('access') : false
  const [buttonState, setButtonState] = useState(flag);

  return (
    <ButtonContext.Provider value={{ buttonState, setButtonState }}>
      {props.children}
    </ButtonContext.Provider>
  );
};