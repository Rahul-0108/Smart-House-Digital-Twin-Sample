import { IModelRpcProps, RpcInterface, RpcManager } from "@bentley/imodeljs-common";
import { Id64String } from "@bentley/bentleyjs-core";

// The RPC query interface that must be exposed by the backend.
export abstract class CategoriesQueriesRpcInterface extends RpcInterface {
 public static readonly interfaceName = "CategoriesQueriesRpcInterface"; // The immutable name of the interface
 public static interfaceVersion = "0.0.1"; // The API version of the interface
 public static getClient() {
  return RpcManager.getClientForInterface(this);
 }
 public async getCategoriesECInstanceIds(_iModelToken: IModelRpcProps, _categories: string[]): Promise<Id64String[]> {
  return this.forward(arguments);
 }
}
