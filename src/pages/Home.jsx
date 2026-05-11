import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import Styles from "../styles/global.module.scss";
import { getAllPosts, useGetAllPostsQuery } from "../slices/apiSlice";
import Card from "../components/Card/Card";
import CreatePostButton from "../components/PostModals/CreatePostButton";
import PostInteractions from "../components/PostInteractions/PostInteractions";
import SearchBar from "../components/SearchBar/SearchBar";

export default function Home() {
   const { isLoading, isFetching, isSuccess, isError, error } =
      useGetAllPostsQuery();
   const allPosts = useSelector(getAllPosts);
   const [searchId, setSearchId] = useState("");

   const handleSearch = useCallback((value) => {
      if (!value || /^\d+$/.test(value)) setSearchId(value);
   }, []);

   // data results from search by Id from Redux store
   const displayedPosts = useMemo(
      () =>
         (searchId
            ? allPosts.filter((post) => post.id.toString().includes(searchId))
            : allPosts
         ).sort((a, b) => b.id - a.id),
      [allPosts, searchId],
   );

   const cardDeckClass = isFetching
      ? [Styles.card_deck, Styles.disabled].join(" ")
      : Styles.card_deck;

   useEffect(() => {
      document.title = "Home | GlobeQuery";
   }, []);

   const renderContent = useCallback(() => {
      if (isLoading) return <h2>Loading...</h2>;
      if (isError) return <p>{error?.message}</p>;
      if (!isSuccess) return null;
      if (searchId && displayedPosts.length === 0)
         return (
            <div className="card">
               <h2>No post found for ID: {searchId}</h2>
            </div>
         );

      return displayedPosts.map((post) => (
         <Card
            key={post.id}
            post={post}
         >
            <PostInteractions post={post} />
         </Card>
      ));
   }, [isLoading, isError, isSuccess, searchId, displayedPosts, error]);

   return (
      <main className={Styles.page_layout}>
         <SearchBar
            search={searchId}
            setSearch={handleSearch}
            placeholder="search by ID..."
         />
         <CreatePostButton />
         <section className={cardDeckClass}>{renderContent()}</section>
      </main>
   );
}
