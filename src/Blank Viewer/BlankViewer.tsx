import "../App.scss";
import { IModelApp } from "@bentley/imodeljs-frontend";
import React, { useContext, useEffect, useState } from "react";
import ViewerContext from "../ViewerContext";
import { Header } from "Header";
import { BlankViewer } from "@itwin/web-viewer-react";
import { ColorTheme } from "@bentley/ui-framework";
import { ColorDef } from "@bentley/imodeljs-common";
import { initializeBlankViewer, openGeometryblankConnection } from "./OnIModelAppInit";
import { GeometryDecoratorUiItemsProvider } from "./GeometryDecoratorUiItemsProvider";

const ExampleBlankViewer: React.FC = () => {
 const { authOptions } = useContext(ViewerContext);
 const [isAuthorized, setIsAuthorized] = useState(false);
 const [isLoggingIn, setIsLoggingIn] = useState(false);

 /** Ensure client variables exist. */
 if (!process.env.IMJS_AUTH_CLIENT_CLIENT_ID) {
  throw new Error("Please add a valid OIDC client id to the .env file and restart the application. See the README for more information.");
 }
 if (!process.env.IMJS_AUTH_CLIENT_SCOPES) {
  throw new Error("Please add valid scopes for your OIDC client to the .env file and restart the application. See the README for more information.");
 }
 if (!process.env.IMJS_AUTH_CLIENT_REDIRECT_URI) {
  throw new Error("Please add a valid redirect URI to the .env file and restart the application. See the README for more information.");
 }

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

 const onIModelAppInit = async () => {
  // on IModelApp startUp , IModelApp.authorizationClient initially checks if there is an unexpired Access Token in browser and uses that and make the user logged-in
  setIsAuthorized(IModelApp.authorizationClient?.isAuthorized || false);
  IModelApp.authorizationClient?.onUserStateChanged.addListener(async () => {
   setIsAuthorized((IModelApp.authorizationClient?.hasSignedIn && IModelApp.authorizationClient?.isAuthorized) || false);
  });

  if (IModelApp.authorizationClient?.isAuthorized) {
   initializeBlankViewer();
  }
 };

 // Now ,after every 1 Hour, The App prompts to Sign-in again, silentSignIn is not configured
 return (
  <div className="viewer-container">
   <Header handleLogin={onLoginClick} loggedIn={isAuthorized} handleLogout={onLogoutClick} />
   {isLoggingIn ? (
    <span>"Logging in...."</span>
   ) : (
    <BlankViewer
     onIModelAppInit={onIModelAppInit}
     blankConnection={openGeometryblankConnection()}
     viewStateOptions={{ displayStyle: { backgroundColor: ColorDef.white }, setAllow3dManipulations: true, viewFlags: { grid: true } }}
     authConfig={authOptions}
     uiProviders={[new GeometryDecoratorUiItemsProvider()]}
     theme={ColorTheme.Light}
    />
   )}
  </div>
 );
};

export default ExampleBlankViewer;
