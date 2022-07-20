import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { useAuth } from "@/firebase/auth";
import { db } from "@/firebase/clientApp";
import Header from "@/components/Layout/Header";
import SideMenu from "@/components/Layout/SideMenu";
import Loading from "@/components/Loading";

import CommunityPreview from "@/components/Community/CommunityPreview";

const Community = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    console.log(`user.uid: ${user.uid}`);
    const loadAccounts = async () => {
      try {
        // thread collection reference
        const usersRef = collection(db, "users");
        const usersSnap = await getDocs(usersRef);
        const data = usersSnap.docs.map((user) => {
          return {
            ...user.data(),
            id: user.id,
            initials: user.data().firstName.at(0).toUpperCase() + user.data().lastName.replace(/ /g, '').at(0).toUpperCase(),
            fullName: (user.data().firstName.toLowerCase() + " " + user.data().lastName.toLowerCase()).replace(/  +/g, ' '),
          };
        });

        const allAccountsButUser = data.filter(userData => {
          if (userData.id != user.uid)
            return userData;
        });
        console.log(`data: ${data.length}`);
        console.log(`allAccountsButUser: ${allAccountsButUser.length}`);
        setAccounts(allAccountsButUser);
      } catch (err) {
        console.log(err);
      }
    };

    loadAccounts();
    setIsLoading(false);
  }, []);

  console.log(
    `users: `,
    accounts,
    ` && liveSessions Length: `,
    accounts.length
  );

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
            {accounts.length > 0 ? (
              <CommunityPreview communityAccounts={accounts} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
