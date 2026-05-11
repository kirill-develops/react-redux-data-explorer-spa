import React, { useMemo, useState } from "react";
import { customAlphabet } from "nanoid";
import { useSelector } from "react-redux";

import Styles from "./PostModal.module.scss";
import {
   getAllPosts,
   useAddOnePostMutation,
   useEditOnePostMutation,
} from "../../slices/apiSlice";

const generateUserId = customAlphabet("1234567890", 12);

function PostModal({ post = {}, toggleModal, modalType = "add" }) {
   const [title, setTitle] = useState(post?.title || "");
   const [body, setBody] = useState(post?.body || "");

   const [addNewPost, { isLoading: addPostLoading }] = useAddOnePostMutation();
   const [editPost, { isLoading: editPostLoading }] = useEditOnePostMutation();

   const allPosts = useSelector(getAllPosts);

   const nextId = useMemo(
      () => allPosts.reduce((max, p) => Math.max(max, p.id), 0) + 1,
      [allPosts],
   );

   const isDisabled = addPostLoading || editPostLoading;
   const canSave = title.length > 2 && body.length > 4 && !isDisabled;

   const onSubmit = async (e) => {
      e.preventDefault();
      if (!canSave) return;

      const postObj =
         modalType === "edit"
            ? { id: post.id, title, body, userId: post.userId }
            : { id: nextId, title, body, userId: generateUserId() };

      try {
         modalType === "edit"
            ? await editPost(postObj).unwrap()
            : await addNewPost(postObj).unwrap();

         setTitle("");
         setBody("");
         toggleModal();
      } catch (err) {
         console.error("failed to update the post: ", err);
      }
   };

   const postTitle = modalType === "edit" ? "Edit this Post" : "Add a New Post";

   return (
      <section className={Styles.overlay}>
         <div className={Styles.modal}>
            <h2>{postTitle}</h2>
            <form className={Styles.form}>
               <label htmlFor="postTitle">Post Title:</label>
               <input
                  type="text"
                  id="postTitle"
                  name="postTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isDisabled}
               />
               <label htmlFor="postContent">Content:</label>
               <textarea
                  id="postContent"
                  name="postContent"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={isDisabled}
                  className={Styles.input__large}
               />
               <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!canSave}
                  className={Styles.button}
               >
                  Save Post
               </button>
               <button
                  type="button"
                  onClick={toggleModal}
                  disabled={isDisabled}
                  className={Styles.button}
               >
                  Cancel
               </button>
            </form>
         </div>
      </section>
   );
}

export default React.memo(PostModal);
