import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Markdown from 'react-markdown';
import { ArticleModel } from "./types/DtoTypes";

function Article() {
    const [article, setArticle] = useState<ArticleModel | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { id } = useParams();

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get<ArticleModel>(`/article/${id}`);
                setArticle(response.data);
                // console.log(article);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []); 


    return (
        <>
            {isLoading ? <div>page is loading</div> : error ? <div>{error}</div> : <><h1>{article!.title}</h1><Markdown>{ article!.text}</Markdown></>}
        </>
    )
}

export default Article;
