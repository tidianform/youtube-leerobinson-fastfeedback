import cookie from "js-cookie";

import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "./firebase";
import { createUser } from "./db";
import Router from "next/router";

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      const { token, ...userWithoutToken } = user;

      createUser(user.uid, userWithoutToken);
      setUser(user);

      cookie.set("fast-feedback-auth", true, {
        expires: 1,
      });

      return user;
    } else {
      Router.push("/");

      setUser(false);
      cookie.remove("fast-feedback-auth");
      return false;
    }
  };

  const signinWithGitHub = () => {
    Router.push("/dashboard");

    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => {
        handleUser(response.user);
      });
  };

  const signinWithGoogle = () => {
    Router.push("/dashboard");

    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => {
        handleUser(response.user);
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        handleUser(false);
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);

    return () => unsubscribe();
  }, []);

  return {
    user,
    signinWithGitHub,
    signinWithGoogle,
    signout,
  };
}

const formatUser = async (user) => {
  const displayName = user.displayName ? user.displayName : "anonymous";
  const idTokenResult = await user.getIdTokenResult();

  return {
    uid: user.uid,
    email: user.email,
    name: displayName,
    token: idTokenResult.token,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
  };
};
