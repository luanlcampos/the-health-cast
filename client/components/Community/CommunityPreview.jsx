import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import Loading from "@/components/Loading";

import CommunityUser from "./CommunityUser";

// pagination
import Pagination from "../Pagination/Pagination";

const PageSize = 6;

const CommunityPreview = ({ communityAccounts }) => {
  const [isLoading, setIsLoading] = useState(true);

  const accounts = communityAccounts;
  console.log(`accounts: `, accounts);
  console.log(`accounts.length: `, accounts.length);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  let currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    console.log(lastPageIndex, ` ... lastPageIndex`);
    return accounts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, accounts]);
  console.log(`currentTableData.length: `, currentTableData.length);

  return (
    <div>
      <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 my-10">          
          {isLoading && !accounts ? (
            <Loading />
          ) : ( accounts.length > 0?
            (currentTableData.map((account, index) => {
              return (
                //<div key={account.id}>{account.id}</div>
                <CommunityUser key={account.id} account={account}/>
              );
            })) : (<div>No registered users on THCA.</div>)
          )}
      </div>
      <Pagination
        className="pagination-bar pt-3"
        currentPage={currentPage}
        totalCount={accounts.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />      
    </div>
  );
};

export default CommunityPreview;
