
import { Editable, useEditor } from "@wysimark/react";
import { createRef, useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { CreateArticleModel } from "./types/DtoTypes";

function CreateArticle(): JSX.Element {
    const [markdown, setMarkdown] = useState("# Hello World");
    const titleInput = createRef<HTMLInputElement>();
    
  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async () => {
      //console.log(input.files);
      const response = await axios.postForm('/image', { image: input.files![0] });
setMarkdown((oldValue) => `${oldValue} ![image1](${response.data})` ) 
      console.log(response);

    }

    input.click();
    
  }
    const createArticle = (article: CreateArticleModel) => {
        axios.post("/article", article);
    };

    const editor = useEditor({});

    useEffect(() => {

        const localStorageMarkdownJson = localStorage.getItem('article-draft')
        if (!localStorageMarkdownJson) {
            return;
        }
        setMarkdown(JSON.parse(localStorageMarkdownJson)?.text);
    },[])
    
    const setLocalStorage = useCallback((markdown: string) => {
        //console.log(titleInput.current?.value)
        setMarkdown(markdown);
        localStorage.setItem('article-draft', JSON.stringify({ text: markdown, title: titleInput.current?.value }));
    }, [titleInput])
    
  return (
      <>
          <input ref={titleInput}></input>
          <Editable
              editor={editor}
              value={markdown}
              onChange={setLocalStorage}
          />
          <button
              onClick={() => {
                  createArticle({
                      title: titleInput.current!.value,
                      text: markdown,
                      is_published: true,
                  });
                  localStorage.clear();
                  setMarkdown('');
                  window.location.reload();
              }}
          >
              Publish article
          </button>
          <button
              onClick={() =>
                  createArticle({
                      title: titleInput.current!.value,
                      text: markdown,
                      is_published: false,
                  })
              }
          >
              Save as draft
          </button>
          <button onClick={importData}>Upload pic</button>
      </>
  );
}

export default CreateArticle
