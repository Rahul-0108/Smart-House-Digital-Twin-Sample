import { IModelApp } from "@bentley/imodeljs-frontend";
import { AccessToken, AuthorizedClientRequestContext } from "@bentley/itwin-client";
import { SettingsResult, SettingsStatus } from "@bentley/product-settings-client";
import { settings } from "cluster";

export class ProductSettingsService {
 private static _productSettingsServiceInstance: ProductSettingsService;
 private static _requestContext: AuthorizedClientRequestContext;

 public static Instance(accessToen?: AccessToken): ProductSettingsService {
  if (!ProductSettingsService._productSettingsServiceInstance && accessToen) {
   ProductSettingsService._requestContext = new AuthorizedClientRequestContext(accessToen);
   ProductSettingsService._productSettingsServiceInstance = new ProductSettingsService();
  }
  return ProductSettingsService._productSettingsServiceInstance;
 }

 // This Setting is not shared between two different Email Ids even if both of them have access to the same context Id and iModel Id
 public async saveUserSetting(
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
 public async getUserSetting(
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
 public async saveSetting(
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
 public async getSetting(
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
 public async saveSharedSetting(
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
 public async getSharedSetting(
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
