import react, { useState } from "react";
import Link from "next/link";
import Select from "react-select";
import { auth, db } from "../firebase/clientApp";
import { sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuth } from "../firebase/auth";

const orgOptions = [
  { value: "org1", label: "Org1" },
  { value: "org2", label: "Org2" },
  { value: "org3", label: "Org3" },
];

export default function SignUp() {
  const { user, signup } = useAuth();
  const router = useRouter();
  // first name state
  const [firstName, setFirstName] = useState("");

  // last name state
  const [lastName, setLastName] = useState("");

  // email state
  const [email, setEmail] = useState("");

  // loading state
  const [loading, setLoading] = useState(false);

  // password state
  const [password, setPassword] = useState("");

  // confirm password state
  const [confirmPassword, setConfirmPassword] = useState("");

  // is hcp state
  const [isHcp, setIsHcp] = useState(false);

  // hcpOrg state
  const [hcpOrg, setHcpOrg] = useState("");

  // error message state
  const [errorMessage, setErrorMessage] = useState("");

  if (user) {
    router.push("/");
    return;
  }

  // handle signup with firebase createUserWithEmailAndPassword
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        setLoading(false);
        return;
      }
      const res = await signup(email, password);
      // send user email verification
      await sendEmailVerification(auth.currentUser);
      // create user in firestore
      await setDoc(doc(db, "users", res.user.uid), {
        firstName,
        lastName,
        email,
        isHcp,
        hcpOrg,
        interests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setLoading(false);
      // redirect to login page
      router.push("/login");
    } catch (error) {
      // catch already exists error
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage(
          <p>
            Email already in use. Try{" "}
            <Link href="/login" className="text-blue-500">
              logging in.
            </Link>
          </p>
        );
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Password is too weak");
      } else {
        setErrorMessage(error.message);
      }
      console.warn(error);
      setLoading(false);
    }
  };

  // return a form with email and password input
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md mt-4 flex flex-col items-center justify-center gap-y-5">
        <img src="/logo.png" alt="logo" className="h-14" />
        <form
          className="bg-white w-full max-h-[calc(100vh-120px)] shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-auto"
          onSubmit={handleSignUp}
        >
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold md:text-md text-gray-800">
              Create your account
            </h1>
          </div>
          <div className="mb-4 text-center">
            <h1 className="text-sm md:text-md text-gray-500">
              We just need few details before you enjoy our platform
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
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="******************"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 form-check form-switch flex flex-row items-center  gap-x-1">
            <input
              className="form-check-input  w-9 rounded-full float-left h-5 bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              value={isHcp}
              onChange={(e) => setIsHcp(e.target.checked)}
            />
            <label
              className="form-check-label inline-block text-gray-800"
              htmlFor="flexSwitchCheckDefault"
            >
              HCP User
            </label>
          </div>

          {isHcp && (
            <div className="mb-4">
              <Select
                options={orgOptions}
                onChange={(e) => setHcpOrg(e.value)}
                placeholder="Select your organization"
                required={isHcp}
              />
            </div>
          )}
          <div className="flex items-center w-full">
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs mb-4">
          &copy;2022 The Health Cast App. All rights reserved.
        </p>
      </div>
    </div>
  );
}
