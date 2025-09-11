import SortHotel from "../sort/SortHotel";
import FilterByAmenities from "./FilterByAmenities";
import FilterByPriceRange from "./FilterByPriceRange";
import FilterByStarCategory from "./FilterByStarCategory";

const Filter = () => {
  return (
    <>
      <div className="col-span-3 space-y-4">
        <SortHotel/>
        <FilterByPriceRange />
        <FilterByStarCategory />
        <FilterByAmenities />
      </div>
    </>
  );
};

export default Filter;
