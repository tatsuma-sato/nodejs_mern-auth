import { useState, createContext } from "react";

const UserContext = createContext([{}, () => {}]);

let initState = {};

const UserProvider = (props) => {
  const [state, setState] = useState(initState);

  return (
    <UserContext.Provider value={[state, setState]}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
