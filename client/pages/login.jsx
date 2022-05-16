import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import Link from "next/link";
import React, { useState } from "react";
import { auth } from "../firebase/clientApp";
import { useAuth } from "../firebase/auth";
import { useRouter } from "next/router";

function Login() {
  // user and login function from useAuth hook
  const { user, login } = useAuth();
  // email state
  const [email, setEmail] = useState("");

  // password state
  const [password, setPassword] = useState("");

  // reset password email state
  const [resetEmail, setResetEmail] = useState("");

  // open reset password modal state
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);

  // resetEmail sent state
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // error message state
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  if (user) {
    router.push("/");
    return;
  }

  // handle login with firebase
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    // call firebase auth to login
    try {
      await login(email, password);
      //redirect to home page
      router.push("/");
    } catch (error) {
      console.warn(error);
      if (error.code === "auth/user-not-found") {
        setErrorMessage("User not found");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Wrong password");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email");
      } else if (error.code === "auth/user-disabled") {
        setErrorMessage("User disabled");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage(
          `Access to this account has been temporarily disabled 
          due to many failed login attempts. You can immediately
           restore it by resetting your password or you can try again later.`
        );
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  // handle forgot password with firebase
  const handleForgotPassword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // call firebase auth to login
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setResetEmailSent(true);
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  // close reset password modal
  const handleCloseResetPasswordModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setResetEmail("");
    setOpenResetPasswordModal(false);
  };

  // return a form with email and password input
  return (
    <>
      {openResetPasswordModal && (
        <div
          onClick={(e) => {
            handleCloseResetPasswordModal(e);
          }}
          className="modal absolute w-full h-full flex justify-center items-center bg-gray-600 bg-opacity-50"
        >
          <div
            className="modal-container relative w-1/3 sm:w-2/3 lg:w-1/3 bg-white border shadow-md rounded-md"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span
              className="absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50 "
              onClick={(e) => {
                handleCloseResetPasswordModal(e);
              }}
            >
              <svg
                className="fill-current text-gray-500 w-6 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
            <div className="modal-content p-4 flex gap-y-5 flex-col">
              <h1 className="text-xl font-bold md:text-md text-gray-800">
                Email to reset password:
              </h1>
              <div className="flex justify-between items-center gap-x-2">
                {!resetEmailSent ? (
                  <>
                    <input
                      htmlFor="resetEmail"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Enter your email..."
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    ></input>
                    <button
                      onClick={handleForgotPassword}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Submit
                    </button>
                  </>
                ) : (
                  <span> Reset password link sent to your email!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="w-full max-w-md flex flex-col items-center justify-center gap-y-5">
          <img src="/logo.png" alt="logo" className="h-20" />
          <span className="text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
            cursus magna eros.
          </span>
          <form
            className="bg-white w-full shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleLogin}
          >
            <div className="mb-4 text-center">
              <h1 className="text-2xl font-bold md:text-md text-gray-800">
                Welcome Back
              </h1>
            </div>
            <div className="mb-4 text-center">
              <h1 className="text-sm md:text-md text-gray-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup">
                  <a className="text-blue-500 font-bold">Create an account</a>
                </Link>
              </h1>
            </div>
            {errorMessage !== "" && (
              <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6 text-center">
              <a
                onClick={() => setOpenResetPasswordModal(true)}
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
            <div className="flex items-center w-full">
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2022 The Health Cast App. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
