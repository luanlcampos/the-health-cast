import Header from "@/components/Layout/Header";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import "../styles/Admin.module.scss";
import Loading from "@/components/Loading";
import HcpTable from "@/components/Admin/HcpTable";
import OrgBio from "@/components/Admin/OrgBio";
import OrgConsole from "@/components/Admin/OrgConsole";

function Admin() {
  const { user, userData, adminData } = useAuth();

  const router = useRouter();

  if (user && !adminData) {
    return <Loading />;
  }

  if (!user) {
    window.location.href = "/login";
  }

  if (user && (userData || adminData)) {
    if ((userData && userData.isHcp === false) || adminData === null) {
      router.push("/");
      return;
    }
  }
  return (
    <>
      <Header user={user} />
      <div className="main">
        <div className="container org-opt">
          <OrgBio user={user} adminData={adminData} />
          <OrgConsole user={user} />
        </div>
        <HcpTable user={user} />
      </div>
    </>
  );
}

export default Admin;
