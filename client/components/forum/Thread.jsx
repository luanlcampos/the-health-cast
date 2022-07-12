const Thread = ({ thread, user }) => {
  return (
    <div className="w-full">
      {/* Title */}
      <div className="px-10 py-5">
        <h2 className="text-2xl">{thread.title}</h2>
        <div className="border-b border-black mb-5"></div>

        {/* Content */}
        <div className="flex bg-my-green rounded-xl shadow-lg">
          <div className="w-[150px] h-[150px]">
            <img
              src="https://via.placeholder.com/150"
              width="150px"
              height="150px"
              className="p-4 rounded-full"
              alt="profile"
            />
          </div>
          <div className="flex-1 p-5">
            <div className="text-xl">{user}</div>
            <div>{thread.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thread;
