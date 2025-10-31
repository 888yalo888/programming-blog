import { Editable, useEditor } from "@wysimark/react";
import { createRef, useCallback, useEffect, useState, useContext } from "react";
import axios from './utils/axios.ts'
import { CreateArticleModel, UserProfile } from "./types/DtoTypes";
import { Navigate } from "react-router";
import ProfileContext from "./context/ProfileContext";

function CreateArticle(): JSX.Element {
  const [markdown, setMarkdown] = useState("");
  const titleInput = createRef<HTMLInputElement>();
  // const [profile, setProfile] = useState<UserProfile | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [isloading, setIsLoading] = useState<boolean>(true);

  //TODO add another useEffect to fetch user profile again like in Nav component and check if use if admin...done!
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      "ProfileContext must be used within a ProfileContextProvider"
    );
  }

  const { profile } = context;

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

  console.log("profile role", profile!.role);
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
