import axios from "axios";
import React, { useState } from "react";

function Comments({ articleId }: { articleId: number }) {
    const [comment, setComment] = useState<string | null>(null);

    const postComment = () => {
        axios.post(`/article/${articleId}/comment`, {
            user_id: 1,
            comment: comment,
        });
    };

    return (
        <>
            <input
                type="text"
                placeholder="what do you think about it?"
                value={comment ?? ""}
                onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={postComment}>Respond</button>
        </>
    );
}

export default Comments;
