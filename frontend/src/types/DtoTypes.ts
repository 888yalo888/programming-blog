export interface ArticleModel {
    text: string | null;
    title: string;
    id: number;
    comments_count: string | null;
    created_at: string;
    likes_count: string | null;
}

export interface CreateArticleModel {
    title: string;
    text: string;
    is_published: boolean;
}

export interface PaginationInfo {
    page_number: number;
    page_size: number;
    results_count: number;
}

export interface PageResult<T>{
    page_info: PaginationInfo;
    page_results: Array<T>;
}

