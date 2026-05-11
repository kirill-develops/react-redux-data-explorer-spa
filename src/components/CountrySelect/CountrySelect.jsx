import React from "react";
import Styles from "../../styles/global.module.scss";

import { useGetCountriesQuery } from "../../slices/universitySlice";

const CountrySelect = ({ selectedCountry, onCountryChange }) => {
   const {
      data: countries = [],
      isLoading,
      isSuccess,
      isError,
   } = useGetCountriesQuery();

   const handleChange = (e) => {
      onCountryChange(e.target.value);
   };

   const renderOptions = () => {
      if (isLoading) return <option disabled>Loading...</option>;
      if (isError) return <option disabled>Failed to load countries</option>;

      return countries.map((country) => (
         <option
            key={country.name}
            value={country.name}
         >
            {country.name}
         </option>
      ));
   };

   return (
      <section className={Styles.search_wrapper}>
         <select
            value={selectedCountry}
            onChange={handleChange}
            disabled={!isSuccess}
            className={Styles.search}
         >
            <option
               value=""
               disabled
            >
               Select a Country
            </option>
            {renderOptions()}
         </select>
      </section>
   );
};

export default React.memo(CountrySelect);
