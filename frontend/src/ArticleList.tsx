import axios from "./utils/axios.ts";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArticleModel, PageResult } from "./types/DtoTypes";
import Pagination from "./Pagination";
import Markdown from 'react-markdown'

function ArticleList() {
  const [articles, setArticles] = useState<PageResult<ArticleModel> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const resultsOnPage = 10;

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `article/all?pageNumber=${pageNumber}&resultsOnPage=${resultsOnPage}`
        );
        console.log("response", response.data);
        setArticles(response.data);
        //console.log('articles', articles?.page_results);
        setTotalPages(
          Math.ceil(
            response.data.page_info.result_count /
              response.data.page_info.page_size
          )
        );
        //console.log(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [pageNumber]);
    
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

  return (
    <div className="flex flex-col justify-between max-h-[calc(100vh-11vh)]">
      <div className="flex-grow flex flex-col items-center overflow-scroll">
        {isLoading ? (
          <div> page is loading</div>
        ) : error ? (
          <div> {error}</div>
        ) : (
          articles?.page_results?.map((item: ArticleModel) => (
            <div key={item.id} className="mb-8 w-full max-w-2xl">
              <Link
                className="text-gray-800 text-xl font-bold block mb-2"
                to={`/article/${item.id}`}
              >
                {item.title}
              </Link>
              <div className="text-[#6B6B6B]">
                {formatDate(item.created_at)}
              </div>
              <Markdown className="text-[#6B6B6B] mt-4">{item.text}</Markdown>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center">
        <Pagination
          totalPages={totalPages ?? 0}
          activePage={pageNumber}
          onPageChange={(pageNumber) => setPageNumber(pageNumber)}
        />
      </div>
    </div>
  );
}

export default ArticleList;
