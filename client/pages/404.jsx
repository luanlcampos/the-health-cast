import Header from "../components/Layout/Header";
import SideMenu from "../components/Layout/SideMenu";
import Footer from "../components/Layout/Footer";
import Button from "@mui/material/Button";
import Link from "next/link";

// pages/404.js
export default function Custom404() {
  //   return <h1>404 - Page Not Found</h1>;
  return (
    <div className="min-h-screen ">
      <Header />
      <div className="main-container flex flex-column h-[calc(100vh-70px)]">
        <div className="side-menu w-2/12 min-w-[200px]">
          <SideMenu />
        </div>
        <div className="main-content w-full px-10 py-5">
          <div className="main-content-header flex flex-col gap-x-10">
            <h1 className="text-3xl font-bold pb-5">Sorry</h1>
          </div>
          <div className="grid grid-rows-3 grid-flow-col gap-4">
            <h1>The content you are looking for is not found!</h1>
            <div>
              <Link href="/" passHref={true}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#86a819",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "#a9de09",
                    },
                  }}
                >
                  Return to home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
