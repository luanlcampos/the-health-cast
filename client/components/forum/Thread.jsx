const Thread = () => {
  return (
    <div className="bg-white mb-8 rounded-xl drop-shadow-lg border-2 border-gray-100">
      <div className="flex rounded-xl p-2">
        <div className="min-w-[150px]">
          <img
            src="https://via.placeholder.com/125"
            width="150px"
            height="150px"
            className="p-4"
          />
          <div className="text-center">User Name</div>
        </div>
        <div className="w-1/2 border-r border-gray-400 p-4 hover:cursor-pointer">
          <h2 className="text-2xl pb-2">Discussion Title</h2>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="p-4">
          <div className="grow flex pb-4">
            <div className="mr-7">
              <h4 className="text-gray-400">Replies</h4>
              <div className="text-center">23</div>
            </div>
            <div>
              <h4 className="text-gray-400">Users</h4>
              <div className="text-center">+10</div>
            </div>
          </div>
          <h4 className="text-gray-400">Activity</h4>
          <div>Yesterday, 10:40</div>
        </div>
      </div>
    </div>
  );
};

export default Thread;
