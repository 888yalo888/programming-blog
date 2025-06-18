import axios from './utils/axios.ts'
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Markdown from 'react-markdown';
import { ArticleModel, CommentsModel } from "./types/DtoTypes";
import Comments from "./Comment";

function Article() {
    const [article, setArticle] = useState<ArticleModel | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [comments, setComments] = useState<CommentsModel | null>([]);

    const { id } = useParams();

    useEffect(() => {
        (async () => {
            try {  
                const response = await axios.get<ArticleModel>(
                    `/article/${id}`
                );
                setArticle(response.data);
                // console.log(article);

                const commentsResponse = await axios.get(
                    `/article/${id}/comments`
                );
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
        <>
            {isLoading ? (
                <div>page is loading</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <>
                    <h1>{article!.title}</h1>
                    <Markdown>{article!.text}</Markdown>
                    <Comments articleId={article!.id} />
                    <div>
                        <h2>Comments:</h2>
                        {comments.length === 0 ? (
                            <p>No comments available.</p>
                        ) : (
                            comments.map((comment, index) => (
                                <div key={index}>
                                    <div>{comment.comment}</div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default Article;
