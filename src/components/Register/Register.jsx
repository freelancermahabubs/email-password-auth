import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import app from "../../firebase/firebase.config";
import { Link } from "react-router-dom";
const auth = getAuth(app);

const Register = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleEmailChange = (event) => {
    console.log(event.target.value);
    // setEmail(event.target.value);
  };

  const handlePasswordBlur = (event) => {
    // console.log(event.target.value);
  };

  const handleSubmit = (event) => {
    // 1. prevent page refresh
    event.preventDefault();
    setSuccess("");
    setError("");
    // 2. collect from data
    const email = event.target.email.value;
    const password = event.target.password.value;
    const name = event.target.name.value;
    console.log(email, name, password);
    // validate
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError("Please add at least one Uppercase");
      return;
    } else if (!/(?=.*[0-9].*[0-9])/.test(password)) {
      setError("Please add atLeast two number");
      return;
    } else if (password.length < 6) {
      setError("Please add At least 6 Characters In your Password");
      return;
    }
    // 3. create user in fb
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const loggedUser = result.user;
        console.log(loggedUser);
        setError("");
        event.target.reset();
        setSuccess("User Has Created SuccessFull");
        sendVerificationEmail(result.user);
        updateUserData(result.user, name);
      })
      .catch((error) => {
        console.error(error.message);
        setError(error.message);
      });
  };

  const sendVerificationEmail = (user) => {
    sendEmailVerification(user).then((result) => {
      console.log(result);
      alert("Please Verify Your Email Address");
    });
  };

  const updateUserData = (user, name) => {
    updateProfile(user, {
      displayName: name,
    })
      .then(() => {
        console.log("User Name Updated");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  return (
    <div className="w-50 mx-auto">
      <h2>Please Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-50 mb-4 rounded ps-2"
          onChange={handleEmailChange}
          type="email"
          name="email"
          id="email"
          placeholder="Your Email"
          required
        />
        <br />
        <input
          className="w-50 mb-4 rounded ps-2"
          type="text"
          name="name"
          id="name"
          placeholder="Your Name"
          required
        />
        <br />
        <input
          className="w-50 mb-4 rounded ps-2"
          onBlur={handlePasswordBlur}
          type="password"
          name="password"
          id="password"
          placeholder="Your Password"
          required
        />
        <br />
        <input className="btn btn-primary" type="submit" value="Register" />
      </form>
      <p>
        <small>
          AlReady Have an Account Please <Link to="/login">Login</Link>
        </small>
      </p>
      <p className="text-danger">{error}</p>
      <p className="text-success">{success}</p>
    </div>
  );
};

export default Register;
