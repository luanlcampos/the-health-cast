import React, { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "./clientApp";
import { getDoc, doc } from "firebase/firestore";

// ReportData model
import { ReportData } from "@/model/forms/ReportData";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// maybe for handling deletion and querying of reports on admin console??
