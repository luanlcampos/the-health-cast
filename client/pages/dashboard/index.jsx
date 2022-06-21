import React, { useState } from "react";
import Header from "@/components/Layout/Header";
//import ManageLiveSessionsIndex from "@/components/Dashboard/ManageLiveSessions/ManageLiveSessions";
import Dashboard from "@/components/Dashboard/Dashboard";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import Loading from "@/components/Loading";

import { v4 as uuidv4 } from "uuid";

export default function DashboardPage() {
  // obtaining user info from AuthProvider
  const { user, userData } = useAuth();

  // obtaining Live session ID
  const router = useRouter();
  const givenLiveSessionID = router.query.id;

  // redirect user back to the login page
  if (!user) {
    router.push("/login");
    return;
  } else if (!userData) {
    return <Loading />;
  } else if (userData.isHcp === false) {
    router.push("/");
    return;
  }

  return (
    <>
      <Header user={user} />
      <Dashboard></Dashboard>
    </>
  );
}
