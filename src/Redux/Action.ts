export const setElement = "setSelectedElement";
export type ActionType = { type: string; payload: any };

export function setSelectedElement(element: any): ActionType {
 return { type: setElement, payload: element };
}
