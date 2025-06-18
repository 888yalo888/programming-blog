import React, { createContext, useEffect, useState } from "react";
import axios from '../utils/axios.ts'
import { Profile } from "../types/profileContextTypes";
import { UserProfile } from "../types/DtoTypes";

const ProfileContext = createContext<Profile | undefined>(undefined);

export function ProfileContextProvider(props: { children: React.JSX.Element }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/profile", {
          withCredentials: true,
        });
        //onsole.log("profile response", response.data.user);
        setProfile(response.data.user);
        //console.log(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <h1>user is loading</h1>;

  return (
    <ProfileContext.Provider
      value={{
        profile,
        error,
        isLoading,
      }}
    >
      {props.children}
    </ProfileContext.Provider>
  );
}

export default ProfileContext;
