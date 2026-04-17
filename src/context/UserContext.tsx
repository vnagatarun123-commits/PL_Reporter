import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  reporterLicence: string;
  yearsOfExperience: string;
  artStyle: string;
  bio: string;
  followers: number;
  following: number;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

const defaultUser: User = {
  id: '486',
  fullName: 'tyuu',
  mobile: '+91-7075868751',
  email: '',
  address: 'Hyderab',
  reporterLicence: '23',
  yearsOfExperience: '6',
  artStyle: 'crim',
  bio: 'testinghhh',
  followers: 0,
  following: 0,
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
