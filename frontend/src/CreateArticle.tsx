import { Editable, useEditor } from "@wysimark/react";
import { createRef, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CreateArticleModel, UserProfile } from "./types/DtoTypes";
import { Navigate } from "react-router";

function CreateArticle(): JSX.Element {
  const [markdown, setMarkdown] = useState("# Hello World");
  const titleInput = createRef<HTMLInputElement>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const [isloading, setIsLoading] = useState<boolean>(true);

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async () => {
      //console.log(input.files);
      const response = await axios.postForm("/image", {
        image: input.files![0],
      });
      setMarkdown((oldValue) => `${oldValue} ![image1](${response.data})`);
      console.log(response);
    };

    input.click();
  };
  const createArticle = (article: CreateArticleModel) => {
    axios.post("/article", article);
  };

  const editor = useEditor({});

  useEffect(() => {
    const localStorageMarkdownJson = localStorage.getItem("article-draft");
    if (!localStorageMarkdownJson) {
      return;
    }
    setMarkdown(JSON.parse(localStorageMarkdownJson)?.text);
  }, []);

    //TODO add another useEffect to fetch user profile again like in Nav component and check if use if admin...done!
  //TODO refactor use into useContext so I can reuse it everywhere
  //TODO client side caching implementation
  
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/profile", { withCredentials: true });
        console.log("profile response", response.data.user);
        setProfile(response.data.user);
        console.log(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setLocalStorage = useCallback(
    (markdown: string) => {
      //console.log(titleInput.current?.value)
      setMarkdown(markdown);
      localStorage.setItem(
        "article-draft",
        JSON.stringify({ text: markdown, title: titleInput.current?.value })
      );
    },
    [titleInput]
  );

  if (!profile) {
    return <div>Loading...</div>; 
  }

  console.log('profile role',profile!.role)
  if (!profile || profile.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <input ref={titleInput}></input>
      <Editable editor={editor} value={markdown} onChange={setLocalStorage} />
      <button
        onClick={() => {
          createArticle({
            title: titleInput.current!.value,
            text: markdown,
            is_published: true,
          });
          localStorage.clear();
          setMarkdown("");
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

export default CreateArticle;
