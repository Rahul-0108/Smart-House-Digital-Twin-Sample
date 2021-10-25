import "./App.scss";

import { IModelApp } from "@bentley/imodeljs-frontend";
import React, { useContext, useEffect, useState } from "react";

import { browserhistory } from "./browserhistory";
import ViewerContext from "./ViewerContext";
import ViewerStartup from "./ViewerStartup";
import { Header } from "Header";

const App: React.FC = () => {
 const { contextId, iModelId, authOptions } = useContext(ViewerContext);
 const [currContextId, setCurrContextId] = useState(contextId);
 const [currIModelId, setCurrIModelId] = useState(iModelId);
 const [isAuthorized, setIsAuthorized] = useState(false);
 const [isLoggingIn, setIsLoggingIn] = useState(false);

 /** Ensure client variables exist. */
 if (!process.env.IMJS_AUTH_CLIENT_CLIENT_ID) {
  throw new Error(
   "Please add a valid OIDC client id to the .env file and restart the application. See the README for more information."
  );
 }
 if (!process.env.IMJS_AUTH_CLIENT_SCOPES) {
  throw new Error(
   "Please add valid scopes for your OIDC client to the .env file and restart the application. See the README for more information."
  );
 }
 if (!process.env.IMJS_AUTH_CLIENT_REDIRECT_URI) {
  throw new Error(
   "Please add a valid redirect URI to the .env file and restart the application. See the README for more information."
  );
 }

 useEffect(() => {
  if (isAuthorized) {
   const urlParams = new URLSearchParams(window.location.search);
   if (urlParams.has("contextId")) {
    setCurrContextId(urlParams.get("contextId") as string);
   } else {
    if (!process.env.IMJS_CONTEXT_ID) {
     throw new Error(
      "Please add a valid context ID in the .env file and restart the application or add it to the contextId query parameter in the url and refresh the page. See the README for more information."
     );
    }
   }

   if (urlParams.has("iModelId")) {
    setCurrIModelId(urlParams.get("iModelId") as string);
   } else {
    if (!process.env.IMJS_IMODEL_ID) {
     throw new Error(
      "Please add a valid iModel ID in the .env file and restart the application or add it to the iModelId query parameter in the url and refresh the page. See the README for more information."
     );
    }
   }
  }
 }, [isAuthorized]);

 useEffect(() => {
  if (isLoggingIn && isAuthorized) {
   setIsLoggingIn(false);
  }
 }, [isAuthorized, isLoggingIn]);

 const onLoginClick = async () => {
  setIsLoggingIn(true);
  await IModelApp.authorizationClient?.signIn();
 };

 const onLogoutClick = async () => {
  setIsLoggingIn(false);
  await IModelApp.authorizationClient?.signOut();
  setIsAuthorized(false);
 };

 const onIModelAppInit = () => {
  // on IModelApp startUp , IModelApp.authorizationClient initially checks if there is an unexpired Access Token in browser and uses that and make the user logged-in
  setIsAuthorized(IModelApp.authorizationClient?.isAuthorized || false);
  IModelApp.authorizationClient?.onUserStateChanged.addListener(async () => {
   setIsAuthorized((IModelApp.authorizationClient?.hasSignedIn && IModelApp.authorizationClient?.isAuthorized) || false);
  });
 };

 useEffect(() => {
  if (currContextId && currIModelId && isAuthorized) {
   // The history library lets you easily manage session history anywhere JavaScript runs.
   // A history object abstracts away the differences in various environments and provides a minimal API that
   // lets you manage the history stack, navigate, and persist state between sessions.
   browserhistory.push(`?contextId=${currContextId}&iModelId=${currIModelId}`);
   // if not used only localhost:3000 will be shown at the URL in the Browser as push function redirects to the given
   // Value at the current URL,(i.e, localhost:3000) ( it opens the new URL)
  }
 }, [currContextId, currIModelId, isAuthorized]);

 // Now ,after every 1 Hour, The App prompts to Sign-in again, silentSignIn is not configured
 return (
  <ViewerContext.Provider value={{ contextId: currContextId, iModelId: currIModelId, authOptions }}>
   <div className="viewer-container">
    <Header handleLogin={onLoginClick} loggedIn={isAuthorized} handleLogout={onLogoutClick} />
    {isLoggingIn ? <span>"Logging in...."</span> : <ViewerStartup onIModelAppInit={onIModelAppInit} />}
   </div>
  </ViewerContext.Provider>
 );
};

export default App;
