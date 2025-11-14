import axios from "../utils/axios";
import { useState, useContext } from "react";
import ProfileContext from "../context/ProfileContext";
import { CommentsModel } from "../types/DtoTypes";

function Comments({
  articleId,
  onCommentPosted,
}: {
  articleId: number;
  onCommentPosted?: (commentInfo: CommentsModel) => void;
}) {
  const [comment, setComment] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const profileContext = useContext(ProfileContext);
  //   const textareaRef = useRef<HTMLTextAreaElement>(null);

  const postComment = () => {
    if (!comment.trim() || !profileContext?.profile?.id) return;

    const userId = parseInt(profileContext.profile.id);

    axios
      .post(`/article/${articleId}/comment`, {
        user_id: userId,
        comment: comment,
      })
      //TODO: обробити помилку, якщо бек впав ще до обробки коментаря
      .then((res) => {

        const commentInfo = res.data
        setComment("");
        setIsExpanded(false);

        if (onCommentPosted) {
          onCommentPosted(commentInfo);
        }
      }).catch((err) => {
        console.error("Error posting comment:", err);
      })
  };

  const handleInputClick = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setComment("");
    setIsExpanded(false);
  };

  // If user is not logged in show this code
  if (!profileContext?.profile) {
    return (
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600 mb-2">Please log in to leave a comment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-800 ease-in-out ${
          isExpanded ? "h-[160px]" : "h-16 cursor-pointer"
        }`}
        onClick={handleInputClick}
      >
        <div className="p-4">
          <textarea
            //   ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className={
              isExpanded
                ? "w-full p-2 border-none outline-none resize-none text-gray-700 placeholder-gray-300 bg-transparent h-20 focus:ring-0"
                : "resize-none border-none outline-none h-full p-2 cursor-pointer text-gray-300 hover:text-gray-400 transition-all"
            }
          />

          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                postComment();
              }}
              disabled={!comment.trim() || !profileContext?.profile?.id}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                comment.trim() && profileContext?.profile?.id
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Respond
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comments;
