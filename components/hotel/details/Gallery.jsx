import Image from "next/image";

const Gallery = ({ gallery }) => {
  const [mainPic, ...restPics] = gallery;
  return (
    <section className="container">
      <div className="grid grid-cols-2 imageshowCase">
        <Image
          src={mainPic}
          className="h-[400px]"
          alt="Main Pic"
          width={400}
          height={400}
        />
        <div className="grid grid-cols-2 grid-rows-2 h-[400px]">
          {restPics.map((image) => (
            <Image
              key={image}
              src={image}
              className="h-[400px]"
              alt="Sub Pics"
              width={400}
              height={400}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
