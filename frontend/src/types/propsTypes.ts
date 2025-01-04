export interface PaginationProps {
    activePage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
}