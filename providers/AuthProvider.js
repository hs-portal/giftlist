import React, { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import Realm from "realm";
import * as Linking from "expo-linking";
import app from "../RealmApp";
import { makeRedirectUri } from "expo-auth-session";

import * as Google from "expo-auth-session/providers/google";

// Create a new Context object that will be provided to descendants of
// the AuthProvider.
const AuthContext = React.createContext(null);

// The AuthProvider is responsible for user management and provides the
// AuthContext value to its descendants. Components under an AuthProvider can
// use the useAuth() hook to access the auth value.
const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(app.currentUser);

  const [accessToken, setAccessToken] = useState("");
  const [idToken, setIdToken] = useState("");

  const [userInfo, setUserInfo] = useState(null);

  const redirectUrl = Linking.createURL("/");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "634509221384-8ebojs8orh0lou3ogclhm4947k8ca4n5.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({
      scheme: "com.hotsource.giftlist",
    }),
  });

  const realmRef = useRef(null);

  useEffect(() => {
    if (!user) {
      console.warn("NO USER Logged In");
      //return;
      router.replace("/sign-in");
      return;
    }

    const config = {
      sync: {
        user,
        partitionValue: `user=${user.id}`,
      },
    };

    // Open a realm with the logged in user's partition value in order
    // to get the links that the logged in user added
    // (instead of all the links stored for all the users)
    Realm.open(config).then((userRealm) => {
      realmRef.current = userRealm;
    });

    return () => {
      // cleanup function
      const userRealm = realmRef.current;
      if (userRealm) {
        userRealm.close();
        realmRef.current = null;
      }
    };
  }, [user]);

  useEffect(() => {
    if (response?.type === "success") {
      if (accessToken !== response.authentication.accessToken) {
        console.log("response was succesful: ");

        //setAccessToken(response.authentication.accessToken);
        //setIdToken(response.authentication.idToken);
        console.log("idtoken:", response.authentication.idToken);
        getUserInfo(
          response.authentication,
          response.authentication.accessToken,
          response.authentication.idToken
        );
      }
    }
  }, [response, accessToken]);

  const getUserInfo = async (auth, accessToken, idToken) => {
    console.log("getUserInfo ");
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const googleUser = await response.json();
      setUserInfo(googleUser);
      console.log(googleUser);
      const credential = Realm.Credentials.jwt(idToken);
      const user = await app.logIn(credential);
      console.log("signed in as Realm user", user.id);
      setUser(user);
    } catch (error) {
      console.log("error: ", error);
      // Add your own error handler here
    }
  };

  // The signIn function takes an email and password and uses the
  // emailPassword authentication provider to log in.
  // This authentication method should be set up correctly on the MongoDB Realm App
  // see: https://docs.mongodb.com/realm/authentication/providers/
  const signIn = async (email, password) => {
    const creds = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(creds);
    setUser(newUser);
  };

  // The signUp function takes an email and password and uses the
  // emailPassword authentication provider to register the user.
  // This authentication should be set up correctly on the MongoDB Realm App
  // see: https://docs.mongodb.com/realm/authentication/providers/
  const signUp = async (email, password) => {
    await app.emailPasswordAuth.registerUser({ email, password });
  };

  // The signOut function calls the logOut function on the currently
  // logged in user
  const signOut = () => {
    if (user == null) {
      console.warn("Not logged in, can't log out!");
      return;
    }
    user.logOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        user,
        request,
        promptAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// The useAuth hook can be used by components under an AuthProvider to
// access the auth context value.
const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error("useAuth() called outside of a AuthProvider?");
  }
  return auth;
};

export { AuthProvider, useAuth };
