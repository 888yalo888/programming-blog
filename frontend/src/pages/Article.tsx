import axios from "../utils/axios.ts";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import Markdown from "react-markdown";
import { ArticleModel, CommentsModel } from "../types/DtoTypes";
import ProfileContext from "../context/ProfileContext";
import Comments from "../components/Comments.tsx";

function Article() {
  const [article, setArticle] = useState<ArticleModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<CommentsModel[]>([]);

  const profileContext = useContext(ProfileContext);

  const { id } = useParams(); 


  const handleCommentPosted = (comment:CommentsModel) => {
    console.log("Comments info:", comment);
    const expandedComment = {
      ...comment,
      user_name: profileContext?.profile?.name || "Anonymous"
    };
    
    setComments([expandedComment, ...comments]);
  
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get<ArticleModel>(`/article/${id}`);
        setArticle(response.data);
        // console.log(article);

        const commentsResponse = await axios.get(`/article/${id}/comments`);
        console.log(commentsResponse.data);
        setComments(commentsResponse.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">page is loading</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-700 font-medium">{error}</div>
          </div>
        ) : (
          <>
            {/* Article Section */}
            <div className="p-6 mb-6 border-b border-gray-300">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {article!.title}
              </h1>
              <div className="text-gray-700 leading-relaxed prose max-w-none mb-6">
                <Markdown>{article!.text}</Markdown>
              </div>

              {/* <div className="flex items-center gap-4 mb-6">
                                <span className="text-sm italic text-gray-500">What do you think about?</span>
                            </div> */}
              {/* <Comments articleId={article!.id} /> */}
            </div>

            {/* Comments Form Section */}
            {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <Comments articleId={article!.id} />
                        </div> */}

            {/* Comments Display Section */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Comments:
              </h2>
              <div className="mb-8">
                <Comments
                  articleId={article!.id}
                  onCommentPosted={handleCommentPosted}
                />
              </div>
              <div className="pt-6">
                {comments.length === 0 ? (
                  <p className="text-gray-500">No comments available.</p>
                ) : (
                  <div className="space-y-6">
                    {comments.map((comment, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-100 pl-4"
                      >
                        {/* User info header */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {comment.user_name
                                ? comment.user_name.charAt(0).toUpperCase()
                                : "U"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.user_name || `User ${comment.user_id}`}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                        {/* Comment content */}
                        <div className="text-gray-700 leading-relaxed">
                          {comment.comment}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Article;
