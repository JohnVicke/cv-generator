import { createContext, useContext, useState } from 'react';
import { GitHubUser } from '../types/github';

type GitHubContextType = {
  authenticated?: boolean;
  user?: GitHubUser;
  authenticate: (user: GitHubUser) => void;
};

interface Props {
  children: React.ReactNode;
}

const GitHubContext = createContext<GitHubContextType>({
  authenticate: (user: GitHubUser) => undefined
});

export function GitHubWrapper({ children }: Props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<GitHubUser | undefined>(undefined);

  const authenticate = (user: GitHubUser) => {
    setAuthenticated(true);
    setUser(user);
  };

  return (
    <GitHubContext.Provider value={{ authenticate, authenticated, user }}>
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHubContext() {
  return useContext(GitHubContext);
}
