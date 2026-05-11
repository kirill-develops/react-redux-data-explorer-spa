import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUniversity, useGetUniQuery } from "../../slices/universitySlice";

export function useUniversityList(country) {
   const [nameFilter, setNameFilter] = useState("");

   const { isFetching, isSuccess, isError } = useGetUniQuery(country, {
      skip: !country,
   });

   const allUniversities = useSelector(getAllUniversity);

   const visibleUniversities = useMemo(
      () =>
         allUniversities.filter((uni) =>
            uni.name.toLowerCase().includes(nameFilter.toLowerCase()),
         ),
      [allUniversities, nameFilter],
   );

   return {
      isFetching,
      isSuccess,
      isError,
      nameFilter,
      setNameFilter,
      visibleUniversities,
   };
}
