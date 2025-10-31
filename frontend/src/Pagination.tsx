import { useState } from "react";
import { PaginationProps } from "./types/propsTypes";

function Pagination(props: PaginationProps) {
  const [activePage, setActivePage] = useState(props.activePage);

  const handleBackwardClick = () => {
    setActivePage(activePage - 1);
    props.onPageChange(activePage - 1);
  };

  const handleForwardClick = () => {
    setActivePage(activePage + 1);
    props.onPageChange(activePage + 1);
  };

  const handleActivePage = (number: number) => {
    setActivePage(number);
    props.onPageChange(number);
  };

  return (
    <div className="flex items-center">
      <button
        className="cursor-pointer text-gray-500 border-none bg-transparent text-lg px-2 py-1 disabled:opacity-50"
        disabled={activePage === 1}
        onClick={handleBackwardClick}
      >
        {'<'}
      </button>
      <ul className="flex list-none p-0 mx-2">
        {Array.from({ length: props.totalPages }, (_, index) => (
          <li
            onClick={() => handleActivePage(index + 1)}
            key={index}
            className={`
                            mx-1 px-3 py-1 cursor-pointer rounded
                            ${
                              activePage === index + 1
                                ? "text-white bg-gray-800"
                                : "text-gray-800 bg-transparent hover:bg-gray-100"
                            }
                        `}
          >
            {index + 1}
          </li>
        ))}
      </ul>
      <button
        className="cursor-pointer text-gray-500 border-none bg-transparent text-lg px-2 py-1 disabled:opacity-50"
        disabled={activePage === props.totalPages}
        onClick={handleForwardClick}
      >
        {'>'}
      </button>
    </div>
  );
}

export default Pagination;
