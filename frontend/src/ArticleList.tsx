import axios from './utils/axios.ts'
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArticleModel, PageResult } from "./types/DtoTypes"; 
import Pagination from "./Pagination";

function ArticleList() {
    const [articles, setArticles] = useState<PageResult<ArticleModel> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    
    const resultsOnPage = 2;


    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(
                  `article/all?pageNumber=${pageNumber}&resultsOnPage=${resultsOnPage}`
                );
                //console.log('response', response);
                setArticles(response.data);
                //console.log('articles', articles);
                setTotalPages(Math.ceil(response.data.page_info.result_count / response.data.page_info.page_size));
                console.log(response.data);

            } catch (err:any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
            
        })();

    },[pageNumber]) 


    return (
        <>
            {isLoading ? (
                <div> page is loading</div>
            ) : error ? (
                <div> {error}</div>
            ) : (
                articles?.page_results?.map((item: ArticleModel) => (
                    <div>
                        <Link to={`/article/${item.id}`}>{item.title}</Link>
                    </div>
                ))
            )}
            <Pagination totalPages={totalPages??0} activePage={pageNumber} onPageChange={(pageNumber) => setPageNumber(pageNumber) }/>
        </>
    );
}

export default ArticleList;
