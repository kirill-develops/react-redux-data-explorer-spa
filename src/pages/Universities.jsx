import React, { useEffect, useState } from "react";
import Styles from "../styles/global.module.scss";
import CountrySelect from "../components/CountrySelect/CountrySelect";
import UniversityList from "../components/UniversityList/UniversityList";

const Universities = () => {
   const [selectedCountry, setSelectedCountry] = useState("");

   useEffect(() => {
      document.title = "University by Country Search | Global Query";
   }, []);

   return (
      <main className={Styles.page_layout}>
         <CountrySelect
            onCountryChange={setSelectedCountry}
            selectedCountry={selectedCountry}
         />
         {selectedCountry && <UniversityList country={selectedCountry} />}
      </main>
   );
};

export default React.memo(Universities);
