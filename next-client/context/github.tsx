import { createContext, useContext, useState } from 'react';
import { uploadResume } from '../api/api';
import { GitHubUser } from '../types/github';

type GitHubContextType = {
  authenticated?: boolean;
  user?: GitHubUser;
  authenticate: (user: GitHubUser) => void;
  uploadPdfToServer: (file: File) => void;
};

interface Props {
  children: React.ReactNode;
}

const GitHubContext = createContext<GitHubContextType>({
  authenticate: (user: GitHubUser) => undefined,
  uploadPdfToServer: (file: File) => undefined
});

export function GitHubWrapper({ children }: Props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<GitHubUser | undefined>(undefined);

  const authenticate = (user: GitHubUser) => {
    setAuthenticated(true);
    setUser(user);
  };

  const uploadPdfToServer = async (file: File) => {
    const blob = new Blob([file], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('resume', blob);
    const res = await uploadResume(formData);
  };

  return (
    <GitHubContext.Provider
      value={{ authenticate, authenticated, user, uploadPdfToServer }}
    >
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHubContext() {
  return useContext(GitHubContext);
}
