import { Card, Button } from "@blueprintjs/core";
import React, { useEffect, useCallback, useContext } from "react";
import { UserContext } from "../context/UserContext";

const Welcome = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  const fetchUserDetails = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((prev) => ({ ...prev, details: data }));
      } else {
        if (response.status === 401) {
          window.location.reload();
        } else {
          setUserContext((prev) => ({ ...prev, details: null }));
        }
      }
    });
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, userContext.details]);

  const logoutHandler = () => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/logout", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      setUserContext((prev) => ({ ...prev, details: undefined, token: null }));
    });
  };

  const refetchHandler = () => {
    setUserContext((prev) => ({ ...prev, details: undefined }));
  };

  return userContext.details === null ? (
    "error loading details"
  ) : !userContext.details ? (
    <div>loading...</div>
  ) : (
    <Card style={{ marginTop: "20px" }}>
      <div className="user-details">
        <div>
          <p>
            Welcome! &nbsp;
            <b>
              {userContext.details.firstName + " "}{" "}
              {userContext.details.lastName}
            </b>
          </p>
          <p>
            Your reward points: <b>{userContext.details.points}</b>
          </p>
        </div>
        <div className="user-action">
          <Button intent="primary" onClick={refetchHandler} text="Refresh" />
          <Button intent="primary" onClick={logoutHandler} text="Logout" />
        </div>
      </div>
    </Card>
  );
};

export default Welcome;
