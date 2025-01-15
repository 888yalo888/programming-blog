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
    } 

    const handleActivePage = (number: number) => {
        setActivePage(number);
        props.onPageChange(number);
    }

    return (
        <>
            <button
                style={{ cursor: "pointer" }}
                disabled={activePage === 1}
                onClick={handleBackwardClick}
            >
                backward
            </button>
            <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
                {Array.from({ length: props.totalPages }, (_, index) => (
                    <li onClick={()=> handleActivePage(index+1)}
                        key={index}
                        style={{
                            margin: "0 10px",
                            padding: "5px 10px",
                            cursor: "pointer",
                            color: activePage === index + 1 ? "white" : "black",
                            backgroundColor:
                                activePage === index + 1
                                    ? "green"
                                    : "lightgray",
                            borderRadius: "5px",
                        }}
                    >
                        {index + 1}
                    </li>
                ))}
            </ul>
            <button style={{ cursor: "pointer" }} disabled={ activePage === props.totalPages} onClick={handleForwardClick}>
                forward
            </button>
        </>
    );
}

export default Pagination