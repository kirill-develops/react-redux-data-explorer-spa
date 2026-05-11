import React, { useState } from "react";

import { useDeleteOnePostMutation } from "../../slices/apiSlice";
import Styles from "./PostInteractions.module.scss";
import PostModal from "../PostModals/PostModal";

function PostInteractions({ post }) {
   const [isEditing, setIsEditing] = useState(false);

   const [deletePost, { isLoading }] = useDeleteOnePostMutation();

   const onDelete = async () => {
      if (post.id && !isLoading) {
         try {
            await deletePost(post.id).unwrap();
         } catch (err) {
            console.error("Failed to delete the post: ", err);
         }
      }
   };

   return (
      <div className={Styles.button_wrapper}>
         <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
         >
            Edit
         </button>
         <button
            type="button"
            onClick={onDelete}
         >
            Delete
         </button>
         {isEditing && (
            <PostModal
               post={post}
               key={post?.id}
               toggleModal={() => setIsEditing(false)}
               modalType="edit"
            />
         )}
      </div>
   );
}

export default React.memo(PostInteractions);
