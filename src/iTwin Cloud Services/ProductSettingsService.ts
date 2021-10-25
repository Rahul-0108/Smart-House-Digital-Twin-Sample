import { IModelApp } from "@bentley/imodeljs-frontend";
import { AccessToken, AuthorizedClientRequestContext } from "@bentley/itwin-client";
import { SettingsResult, SettingsStatus } from "@bentley/product-settings-client";

//This Product Settings service is a generic way of saving settings information for services in CONNECT.
//Consumers provide a JSON bag, and we persist it and provide a way to query for it using a namespace/name
export class ProductSettingsService {
 private static _requestContext: AuthorizedClientRequestContext;

 public static async Initialize(): Promise<void> {
  const accessToken: AccessToken = await IModelApp.authorizationClient?.getAccessToken()!;
  ProductSettingsService._requestContext = new AuthorizedClientRequestContext(accessToken);
 }

 // This Setting is not shared between two different Email Ids even if both of them have access to the same context Id and iModel Id
 public static async saveUserSetting(
  settings: any,
  namespace: string,
  name: string,
  applicationSpecific: boolean,
  projectId?: string,
  iModelId?: string
 ): Promise<void> {
  let result: SettingsResult | undefined = undefined;
  try {
   result = await IModelApp.settings.saveUserSetting(
    ProductSettingsService._requestContext,
    settings,
    namespace,
    name,
    applicationSpecific,
    projectId,
    iModelId
   );
  } catch (error) {
   if (result && result.status !== SettingsStatus.Success) {
    console.log(`Saving User settings failed: ${result}`);
   }
  }
 }

 // This Setting is not shared between two different Email Ids even if both of them have access to the same context Id and iModel Id
 public static async getUserSetting(
  namespace: string,
  name: string,
  applicationSpecific: boolean,
  projectId?: string,
  iModelId?: string
 ): Promise<SettingsResult | undefined> {
  let result: SettingsResult | undefined = undefined;
  try {
   result = await IModelApp.settings.getUserSetting(
    ProductSettingsService._requestContext,
    namespace,
    name,
    applicationSpecific,
    projectId,
    iModelId
   );
  } catch (error) {
   if (result && result.status !== SettingsStatus.Success) {
    console.log(`Getting User settings failed: ${result}`);
   }
  }
  return result;
 }

 // // The settings is shared between different Email Ids
 public static async saveSetting(
  settings: any,
  namespace: string,
  name: string,
  applicationSpecific: boolean,
  projectId?: string,
  iModelId?: string
 ): Promise<void> {
  let result: SettingsResult | undefined = undefined;
  try {
   result = await IModelApp.settings.saveSetting(
    ProductSettingsService._requestContext,
    settings,
    namespace,
    name,
    applicationSpecific,
    projectId,
    iModelId
   );
  } catch (error) {
   if (result && result.status !== SettingsStatus.Success) {
    console.log(`Savins application settings failed: ${result}`);
   }
  }
 }

 // The settings is shared between different Email Ids
 public static async getSetting(
  namespace: string,
  name: string,
  applicationSpecific: boolean,
  projectId?: string,
  iModelId?: string
 ): Promise<SettingsResult | undefined> {
  let result: SettingsResult | undefined = undefined;
  try {
   result = await IModelApp.settings.getSetting(
    ProductSettingsService._requestContext,
    namespace,
    name,
    applicationSpecific,
    projectId,
    iModelId
   );
  } catch (error) {
   if (result && result.status !== SettingsStatus.Success) {
    console.log(`Getting application settings failed: ${result}`);
   }
  }
  return result;
 }

 // The settings is shared between different Email Ids
 public static async saveSharedSetting(
  settings: any,
  namespace: string,
  name: string,
  applicationSpecific: boolean,
  projectId: string,
  iModelId?: string
 ): Promise<void> {
  let result: SettingsResult | undefined = undefined;
  try {
   result = await IModelApp.settings.saveSharedSetting(
    ProductSettingsService._requestContext,
    settings,
    namespace,
    name,
    applicationSpecific,
    projectId,
    iModelId
   );
  } catch (error) {
   if (result && result.status !== SettingsStatus.Success) {
    console.log(`Saving shared settings failed: ${result}`);
   }
  }
 }

 // The settings is shared between different Email Ids
 public static async getSharedSetting(
  namespace: string,
  name: string,
  applicationSpecific: boolean,
  projectId: string,
  iModelId?: string
 ): Promise<SettingsResult | undefined> {
  let result: SettingsResult | undefined = undefined;
  try {
   result = await IModelApp.settings.getSharedSetting(
    ProductSettingsService._requestContext,
    namespace,
    name,
    applicationSpecific,
    projectId!,
    iModelId
   );
  } catch (error) {
   if (result && result.status !== SettingsStatus.Success) {
    console.log(`Getting shared settings failed: ${result}`);
   }
  }
  return result;
 }
}
