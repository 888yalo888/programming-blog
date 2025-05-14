import { UserProfile } from "./DtoTypes";

export interface Profile {
    profile: UserProfile | null;
    error: string | null | undefined;
    isLoading: boolean;
    
}