import HotelImage from "../HotelImage";

const Gallery = ({ images = [], name }) => {
  if (images.length === 0) return null;
  const [mainPic, ...restPics] = images;
  return (
    <div className="grid h-[260px] grid-cols-1 gap-2 overflow-hidden rounded-2xl md:h-[420px] md:grid-cols-2">
      <div className="relative">
        <HotelImage
          src={mainPic}
          alt={name}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="hidden grid-cols-2 grid-rows-2 gap-2 md:grid">
        {restPics.slice(0, 4).map((image, index) => (
          <div key={image} className="relative">
            <HotelImage src={image} alt={`${name} photo ${index + 2}`} sizes="25vw" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
