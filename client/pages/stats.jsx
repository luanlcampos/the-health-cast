import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, doc, getDocs, getDoc, query, where } from "firebase/firestore";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import Header from "@/components/Layout/Header";
import SideMenu from "@/components/Layout/SideMenu";
import Loading from "@/components/Loading";

const Stats = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const loadUserReports = async (uid) => {
      try {
        const q = query(collection(db, "reports"), where("reportedAccountId", "==", uid));
        const qSnapShot = await getDocs(q);

        const reportData = qSnapShot.docs.map((report)=>{
          console.log(`report: ${report.data().reportedSrc}`);

          const regex = /\/(.*)\//
          const type = regex.exec(report.data().reportedSrc).at(1);
          console.log(`type: ${type}`)
          return {...report.data(), reportId: report.id, reportType: type };
        });

        console.log(`reportData in loadUserReports: ${reportData}`);
        setReports(reportData);
      } catch (err) {
        console.log(err);
      }
    };

    loadUserReports(user.uid);   
    setIsLoading(false);
  }, []);


  if (!user) {
    router.push("/login");
    return;
  }

  return (
    <div>
      <div>
        <Header className="z-100" user={user} />
        <div className="flex main-container h-[calc(100vh-70px)]">
          <div className="side-menu w-2/12 min-w-[200px]">
            <SideMenu />
          </div>
          <div className="w-full px-10 py-3">
            <div className="font-semibold text-2xl">Your Current Stats</div>
            <table className="min-w-full mt-5">
              <thead className="bg-gray-300 border-b">
                <tr>
                  <th scope="col" className="text-base font-semibold text-gray-900 px-6 py-4 text-left">
                    #
                  </th>
                  <th scope="col" className="text-base font-semibold text-gray-900 px-6 py-4 text-left">
                    Report Issue
                  </th>
                  <th scope="col" className="text-base font-semibold text-gray-900 px-6 py-4 text-left">
                    Report Details
                  </th>
                  <th scope="col" className="text-base font-semibold text-gray-900 px-6 py-4 text-left">
                    Report Date
                  </th>
                  <th scope="col" className="text-base font-semibold text-gray-900 px-6 py-4 text-left">
                    Report Content Type
                  </th>                  
                </tr>
              </thead>
              <tbody>
                {reports.length === 0
                  ? null
                  : reports.map((report, index /*hcp, index*/) => (
                    <Link key={report.reportId} href={report.reportedSrc} >
                      <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-lime-200 hover:cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{index + 1}</td>
                        <td className="text-base text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {report.reportReason}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {report.reportDetails === "" ||
                          report.reportDetails === null
                            ? "Not Specified"
                            : report.reportDetails}
                        </td>
                        <td className="text-base text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {(new Date(report.createdAt.seconds*1000)).toLocaleString()}
                        </td>
                        <td className="text-base text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {report.reportType}
                        </td>                        
                      </tr>
                    </Link>                  
                ))}
              </tbody>
            </table>       
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
