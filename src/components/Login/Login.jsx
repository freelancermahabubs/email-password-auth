import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import app from "../../firebase/firebase.config";
import { Link } from "react-router-dom";
const auth = getAuth(app);

const Login = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const emailRef = useRef();
  const handleLogin = (event) => {
    event.preventDefault();

    // validation
    setError("");
    setSuccess("");
    const from = event.target;
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError("Please add at least two Uppercase.");

      return;
    } else if (!/(?=.*[!@#$&*])/.test(password)) {
      setError("Please Add a Special Character.");

      return;
    } else if (password.length < 6) {
      setError("Password Must Be 6 Characters Long");

      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const loggedUser = result.user;
        console.log(loggedUser);
        if (!loggedUser.emailVerified) {
          alert("Tumer Eamil Virefed Na");
        }
        setSuccess("User Has Created SuccessFull");
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleForgetPassword = (event) => {
    const email = emailRef.current.value;
    if (!email) {
      alert("Please Provide Your Email Address to Forget Password");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Please Check Your Email");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  return (
    <div className="mx-auto w-25">
      <Form onSubmit={handleLogin}>
        <h2>Please Login</h2>
        <div className="form-group mb-3">
          <label htmlFor="email">Email address</label>
          <input
            ref={emailRef}
            className="form-control"
            type="email"
            name="email"
            id="email"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
        </div>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <p>
        <small>
          Forget Password? Please
          <button onClick={handleForgetPassword} className="btn btn-link">
            Forget
          </button>
        </small>
      </p>
      <p>
        <small>
          New To Website? Please <Link to="/register">Register</Link>
        </small>
      </p>
      <p className="text-danger">{error}</p>
      <p className="text-success">{success}</p>
    </div>
  );
};

export default Login;
