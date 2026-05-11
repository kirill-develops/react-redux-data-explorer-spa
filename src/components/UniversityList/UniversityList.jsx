import React from "react";
import Styles from "../../styles/global.module.scss";
import CardStyles from "../../components/Card/Card.module.scss";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useUniversityList } from "./useUniversityList";

const UniversityList = ({ country }) => {
   const {
      isFetching,
      isSuccess,
      isError,
      nameFilter,
      setNameFilter,
      visibleUniversities,
   } = useUniversityList(country);

   const cardDeckClass = isFetching
      ? [Styles.card_deck, Styles.disabled].join(" ")
      : Styles.card_deck;

   const renderContent = () => {
      if (isError)
         return <h2>Error fetching results. Please refresh the page.</h2>;
      if (isSuccess && visibleUniversities.length === 0)
         return <h2>No institutions matching &quot;{nameFilter}&quot;.</h2>;
      if (isSuccess)
         return visibleUniversities.map((uni) => (
            <div
               key={uni.name}
               className={CardStyles.card}
            >
               <h2>{uni.name}</h2>
               <a
                  href={uni.web_pages[0]}
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  {uni.web_pages[0]}
               </a>
            </div>
         ));
      return null;
   };

   return (
      <>
         <SearchBar
            search={nameFilter}
            setSearch={setNameFilter}
            placeholder="Search institutions..."
         />
         <section className={cardDeckClass}>{renderContent()}</section>
      </>
   );
};

export default React.memo(UniversityList);
