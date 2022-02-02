import React, { useContext, useState } from "react";
import { Button, FormGroup, InputGroup, Callout } from "@blueprintjs/core";
import { UserContext } from "../context/UserContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [userContext, setUserContext] = useContext(UserContext);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    fetch(process.env.REACT_APP_API_ENDPOINT + "users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        username: email,
        password,
      }),
      credentials: "include",
    })
      .then(async (response) => {
        setIsSubmitting(false);

        if (!response.ok) {
          if (response.status === 400) {
            setError("Please fill all the missing fields");
          } else if (response.status === 401) {
            setError("Invalid email add/or password");
          } else if (response.status === 500) {
            const data = await response.json();
            if (data.message) {
              setError(data.message || "something went wrong please try again");
            }
          } else {
            setError("something went wrong please try again");
          }
        } else {
          const data = await response.json();
          setUserContext((prev) => ({ ...prev, token: data.token }));
        }
      })
      .catch((err) => {
        isSubmitting(false);
        setError("something went wrong please try again"); // gengeric error message
      });
  };

  return (
    <>
      {error && <Callout intent="danger">{error}</Callout>}
      <form className="auth-form" onSubmit={formSubmitHandler}>
        <FormGroup label="First Name" labelFor="firstName">
          <InputGroup
            id="firstName"
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup label="Last Name" labelFor="lastName">
          <InputGroup
            id="lastName"
            placeholder="last Name"
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </FormGroup>
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
          intent="primary"
          loading={isSubmitting}
          type="submit"
          text="Sign up"
        />
      </form>
    </>
  );
};

export default Register;
