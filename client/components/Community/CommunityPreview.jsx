import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/firebase/auth";
import Loading from "@/components/Loading";

import CommunityUser from "./CommunityUser";

// pagination
import Pagination from "../Pagination/Pagination";

const PageSize = 6;

const CommunityPreview = ({ communityAccounts }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchAccountsField, setSearchAccountsField] = useState("");  
  const [searchedAccounts, setSearchedAccounts] = useState(null);
  const [useSearch, setUseSearch] = useState(false);
  const { user } = useAuth();

  const accounts = communityAccounts;
  console.log(`accounts: `, accounts);
  console.log(`accounts.length: `, accounts.length);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  let currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    console.log(lastPageIndex, ` ... lastPageIndex`);
    if (searchAccountsField.length == 0)
      return accounts.slice(firstPageIndex, lastPageIndex);
    else if (searchAccountsField.length > 0 && searchedAccounts)
      return searchedAccounts.slice(firstPageIndex, lastPageIndex);      
  }, [currentPage, accounts, searchedAccounts, searchAccountsField]);
  console.log(`currentTableData.length: `, currentTableData.length);

  console.log(`searchAccountsField: ${searchAccountsField}`);

  useEffect(() => {
    let matchingAccts = [];
    const filterAccounts = async () => {
      try {
        //e.preventDefault();
        setSearchedAccounts(null);
        console.log(`value (2nd useEffect): ${searchAccountsField}`);

        if (accounts) {
          matchingAccts = accounts.filter((account) =>
            account.fullName.includes(searchAccountsField.toLowerCase()) ||
            account.initials.includes(searchAccountsField.toUpperCase())
          );
          console.log(
            `searched accounts (matchingAccts): ${JSON.stringify(matchingAccts)}`
          );
          console.log(`matchingAccts.length: ${matchingAccts.length}`);

          setSearchedAccounts(matchingAccts);
          setCurrentPage(1);
          //if (matchingAccts.length > 0 && searchAccountsField.length !== "")
          setUseSearch(true);
        }
        //else
        //  setUseSearch(false);
      } catch (err) {
        console.error(err);
      }
    };
    filterAccounts();

    console.log(
      `state (searchedAccounts): ${
        !searchedAccounts ? 0 : searchedAccounts.length
      }`
    );
  }, [searchAccountsField]);

  return (
    <div>
      <div className="flex flex-1 md:w-1/3 justify-end md:justify-start py-2">
        {user && (
          <span className="relative w-full">
            <input
              type="search"
              className="w-full bg-gray-200 rounded px-3 py-1 focus:outline-none focus:shadow-outline appearance-none leading-normal"
              placeholder="Search By First or Last Name or Initials ..."
              onChange={(e) => setSearchAccountsField(e.target.value)}
              id="onChange={e=>{setSearchAccountsField(e.target.value); filterLiveSessions(e);}}"
            />
          </span>
        )}
        <p>
          {/*!searchedLiveSessions? 0: searchedLiveSessions.length*/}
        </p>
      </div>    
      <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7 mb-auto mt-2">          
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
