const Reply = () => {
  const thread = {
    authorId: "Tony",
    content: "This is Demo Reply",
  };

  return (
    <div className="px-10 py-5">
      <div className="flex">
        <div>
          <img
            src="https://via.placeholder.com/125"
            width="150px"
            height="150px"
            className="p-4 rounded-full"
            alt="profile"
          />
        </div>
        <div className="p-5 grow">
          <div className="text-xl">{thread.authorId}</div>
          <div>{thread.content}</div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
