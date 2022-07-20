import { useAuth } from "@/firebase/auth";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AiOutlineLoading, AiOutlineSearch } from "react-icons/ai";

export default function SearchModal({ setSearchOpen }) {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("search useeffect");
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users", {
          method: "GET",
          headers: {
            Authorization: `${user.accessToken}`,
          },
        });
        const data = await res.json();
        // loop through all users and create a property called fullName that combines first and last name
        data.forEach((user) => {
          user.fullName = `${user.firstName} ${user.lastName}`;
        }),
          setAllUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // get the search input and return the 5 results
  const handleSearch = (e) => {
    if (e.target.value.length > 0) {
      setSearch(e.target.value);
      const filteredUsers = allUsers
        .filter((el) => {
          return (
            user.uid !== el.id &&
            el.fullName.toLowerCase().includes(search.toLowerCase())
          );
        })
        .slice(0, 5);
      console.log(filteredUsers);
      setResults(filteredUsers);
    }
    // if input is empty, set results to empty array
    else {
      setResults([]);
      setSearch("");
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSearch("");
    setResults([]);
    setSearchOpen(false);
  };

  const handleClick = (e, user) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchOpen(false);
    // redirect to user profile page
    // window is needed to prevent bug where the admin has access to change the user's profile
    window.location.href = `/profile/${user.id}`;
    return;
  };

  return (
    <div
      onClick={handleClose}
      className="search-modal absolute z-40 w-screen h-screen bg-[rgba(0,0,0,0.4)] flex justify-center fade-enter"
    >
      <div
        className="search-container w-1/2 max-h-96  bg-white mt-10 rounded-md drop-shadow-xl fade-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-input flex items-center relative m-4">
          <input
            type="text"
            placeholder="Type a name"
            className="w-full bg-gray-200 rounded-full text-lg h-[50px] px-3 py-1 focus:outline-my-green focus:shadow-outline appearance-none leading-normal"
            value={search}
            onChange={(e) => handleSearch(e)}
          />
          <span className="flex absolute right-3 bg-transparent rounded text-base text-gray-600 p-2">
            <AiOutlineSearch className="h-8 w-8" />
          </span>
        </div>
        {loading && (
          <div className="flex h-[calc(100%-85px)] w-full justify-center items-center">
            <AiOutlineLoading className="loading-spinner text-4xl" />
          </div>
        )}
        <div className="search-results m-4 max-h-[calc(100%-85px)] overflow-auto flex flex-col gap-y-1">
          {error && <div>{error.message}</div>}
          {results.length > 0 &&
            results.map((user) => {
              return (
                <div
                  key={user.id}
                  className="flex gap-x-4 py-4 px-3 border border-gray-300 rounded-lg hover:bg-gray-100 hover:cursor-pointer drop-shadow-md fade-enter items-center"
                  onClick={(e) => handleClick(e, user)}
                >
                  <Avatar
                    sx={{
                      width: "40px",
                      height: "40px",
                      bgcolor: "#9FC131",
                      fontSize: "20px",
                    }}
                  >
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </Avatar>
                  <div className="flex item-center gap-x-2 text-lg">
                    {user.fullName}{" "}
                    <span>
                      {user.isHcp ? (
                        <Image
                          src="/images/hcpLogo.svg"
                          width="20px"
                          height="20px"
                        />
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
