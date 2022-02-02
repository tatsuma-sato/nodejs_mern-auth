import { Card, Tab, Tabs } from "@blueprintjs/core";
import { useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "./context/UserContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";

function App() {
  const [currentTab, setCurrentTab] = useState("login");
  const [userContext, setUserContext] = useContext(UserContext);

  const verifyUser = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((prev) => ({ ...prev, token: data.token }));
      } else {
        setUserContext((prev) => ({ ...prev, token: null }));
      }

      setTimeout(verifyUser, 5 * 60 * 1000); // call reafshtoken every 5 mins ot renew token
    });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const syncLogout = useCallback((event) => {
    if (event.key === "logout") {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [syncLogout]);

  return (
    <div className="App">
      {userContext.token === null ? (
        <Card style={{ marginTop: "20px" }}>
          <Tabs id="Tabs" onChange={setCurrentTab} selectedTabId={currentTab}>
            <Tab id="login" title="Login" panel={<Login />} />
            <Tab id="register" title="Register" panel={<Register />} />
          </Tabs>
        </Card>
      ) : userContext.token ? (
        <Welcome />
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}

export default App;
