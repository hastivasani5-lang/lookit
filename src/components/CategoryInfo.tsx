
import CourseList from "./CourseList";
import FilterSidebar from "./FilterSidebar";

// Main Wrapper
type CategoryInfoProps = {
  title: string;
};

export default function CategoryInfo({ title }: CategoryInfoProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full px-4 md:px-8 mt-10">
      <div className="w-full md:w-72">
        <FilterSidebar />
      </div>
      <div className="flex-1">
        <CourseList />
      </div>
    </div>
  );
}