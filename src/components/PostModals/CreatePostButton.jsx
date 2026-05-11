import React, { useReducer } from "react";

import Styles from "./PostModal.module.scss";
import PostModal from "./PostModal";

const CreatePostButton = () => {
   const [postModal, togglePostModal] = useReducer(
      (checked) => !checked,
      false,
   );

   return postModal ? (
      <PostModal
         toggleModal={togglePostModal}
         modalType={"add"}
         key={"new"}
      />
   ) : (
      <button
         type="button"
         onClick={togglePostModal}
         className={Styles.button}
      >
         CREATE POST
      </button>
   );
};

export default React.memo(CreatePostButton);
