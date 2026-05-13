import React, { useEffect, useReducer } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import CardStyles from "../components/Card/Card.module.scss";
import GlobalStyles from "../styles/global.module.scss";
import { useGetZipQuery } from "../slices/postalSlice";
import SearchBar from "../components/SearchBar/SearchBar";

const PostalLookup = () => {
   const [search, setSearch] = useReducer((state, value) => {
      if (!value) return "";
      if (!/^\d+$/.test(value)) return state;
      return value;
   }, "");

   const isValidZip = search.length === 5;

   const {
      data: zipData,
      isLoading,
      isFetching,
      isSuccess,
      isUninitialized,
      isError,
   } = useGetZipQuery(isValidZip ? search : skipToken);

   const cardDeckClass = isFetching
      ? [GlobalStyles.card_deck__postal, GlobalStyles.disabled].join(" ")
      : GlobalStyles.card_deck__postal;

   useEffect(() => {
      document.title = "Postal Lookup | Global Query";
   }, []);

   const renderContent = () => {
      if (isUninitialized)
         return <h2>Please enter 5-digit US zip code to look up locations</h2>;
      if (isLoading) return <h2>Loading...</h2>;
      if (isError) return <h2>No locations found for that zip code</h2>;
      if (isSuccess) {
         const { places, "post code": postCode } = zipData;
         return (
            <section className={cardDeckClass}>
               <h2 className={CardStyles.label}>
                  Results For Zip Code: {postCode}
               </h2>
               {places.map((place) => (
                  <div
                     key={place["place name"]}
                     className={CardStyles.card__multi_row}
                  >
                     <h2 className={CardStyles.title}>
                        {place["place name"]}, {place["state abbreviation"]}
                     </h2>
                     <p className="">State: {place.state}</p>
                     <h4 className={CardStyles.label}>
                        Latitude: {place.latitude}
                     </h4>
                     <h4 className={CardStyles.label}>
                        {" "}
                        Longitude: {place.longitude}
                     </h4>
                  </div>
               ))}
            </section>
         );
      }
   };

   return (
      <main className={GlobalStyles.page_layout}>
         <SearchBar
            search={search}
            setSearch={setSearch}
            placeholder="enter US zipcode..."
         />
         {renderContent()}
      </main>
   );
};

export default PostalLookup;
