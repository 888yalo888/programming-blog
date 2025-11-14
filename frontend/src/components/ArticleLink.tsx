import Markdown from 'react-markdown';
import { Link } from 'react-router'
import { ArticleModel } from '../types/DtoTypes';

interface ArticleLinkProps {
  item: ArticleModel;
}

function ArticleLink({item} : ArticleLinkProps) {

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};
  return (
    <div>
      <div key={item.id} className="mb-8 w-full">
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
    </div>
  )
}

export default ArticleLink