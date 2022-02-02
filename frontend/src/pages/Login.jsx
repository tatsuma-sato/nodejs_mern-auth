import { Button, FormGroup, InputGroup, Callout } from "@blueprintjs/core";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [userContext, setUserContext] = useContext(UserContext);

  // useEffect(() => console.log(userContext));

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    fetch(process.env.REACT_APP_API_ENDPOINT + "users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
      credentials: "include",
    })
      .then(async (response) => {
        setIsSubmitting(false);
        if (!response.ok) {
          if (response.status === 400) {
            setError("Missing Credentials");
          } else if (response.status === 401) {
            setError("Invalid email add/or password");
          } else {
            setError("something wrong");
          }
        } else {
          const data = await response.json();
          setUserContext((prev) => ({ ...prev, token: data.token }));
        }
      })
      .catch((err) => {
        isSubmitting(false);
        setError("something is wrong"); // gengeric error message
      });
  };

  return (
    <>
      {error && <Callout intent="danger">{error}</Callout>}
      <form className="auth-form" onSubmit={formSubmitHandler}>
        <FormGroup label="Email" labelFor="email">
          <InputGroup
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup label="Password" labelFor="password">
          <InputGroup
            id="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </FormGroup>
        <Button
          fill
          loading={isSubmitting}
          intent="primary"
          type="submit"
          text="Sign in"
        />
      </form>
    </>
  );
};

export default Login;
