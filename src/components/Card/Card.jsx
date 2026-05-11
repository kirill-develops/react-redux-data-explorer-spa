import React from "react";

import Styles from "./Card.module.scss";

const Card = ({ post, children }) => (
   <div className={Styles.card}>
      <h3 className={Styles.title}>{post.title}</h3>
      <div className={Styles.body_wrapper}>
         <p className={Styles.body}>{post.body}</p>
         <div className={Styles.metrics}>
            {children}
            <p className={Styles.label}>post ID: {post.id}</p>
         </div>
      </div>
   </div>
);

export default React.memo(Card);
