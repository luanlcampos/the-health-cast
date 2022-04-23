import Link from "next/link";

function UnsignedHome() {
  return (
    <div className=" h-[calc(100vh-70px)] bg-[#fdfdfd]">
      <div className="jumbotron px-5 flex flex-row h-full bg-[#EEEEEE]">
        <div className="j-text flex items-center content-around justify-center flex-col md:w-1/3 gap-y-5 w-full">
          <h1 className="md:text-5xl text-5xl text-black-400 font-bold mb-4 leading-relaxed text-center md:text-left">
            The new way to care about your health
          </h1>
          <div className="buttons w-full flex flex-row flex-wrap md:justify-start justify-center gap-10">
            <button className="px-5 py-2 bg-my-blue rounded-md">
              <Link href="/login">
                <a className="text-white text-xl font-bold">Log In</a>
              </Link>
            </button>
            <button className="px-5 py-2 bg-my-green rounded-md">
              <Link href="/signup">
                <a className="text-white text-xl font-bold">Sign Up</a>
              </Link>
            </button>
          </div>
        </div>
        <div className="j-img w-2/3 hidden md:flex items-center justify-center">
          <object
            data="/images/Doctors-rafiki.svg"
            type="image/svg+xml"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}
export default UnsignedHome;
