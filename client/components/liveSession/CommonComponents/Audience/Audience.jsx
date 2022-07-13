import Image from "next/image";

const Audience = ({ liveSessionRoomID }) => {
  return (
    <div className="flex justify-evenly ">
      <MyImage></MyImage>
      <MyImage></MyImage>
      <MyImage></MyImage>
      <MyImage></MyImage>
      <MyImage></MyImage>
    </div>
  );
};

export default Audience;

const MyImage = (props) => {
  return (
    <img
      src="https://www.txstate.edu/cache25e543ff57a24b5cc694c693ae95e9ea/imagehandler/scaler/gato-docs.its.txstate.edu/jcr:c54a4490-63b5-42ec-b93a-e361ea48b23b/2020-04-14%2B13_06_43-Window.jpg?mode=fit&width=126"
      alt="thumbnail"
      className="rounded-t-xl"
    />
  );
};
