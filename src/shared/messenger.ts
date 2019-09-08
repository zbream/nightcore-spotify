export type NcMessage = NcPromptMultiplerMessage | NcSetMultiplierMessage;

export const enum NcMessageTypes {
  PromptMultiplier = 'PromptMultiplier',
  SetMultiplier = 'SetMultiplier',
}

export function isNcMessage(message: any): message is NcMessage {
  return (!!message && typeof message === 'object' && 'type' in message);
}

interface NcBaseMessage {
  readonly type: NcMessageTypes;
}

// PromptMultiplier

export interface NcPromptMultiplerMessage extends NcBaseMessage {
  type: NcMessageTypes.PromptMultiplier;
}

export function createNcPromptMultiplierMessage(): NcPromptMultiplerMessage {
  return {
    type: NcMessageTypes.PromptMultiplier,
  };
}

export function isNcPromptMultiplierMessage(message: any): message is NcPromptMultiplerMessage {
  return (isNcMessage(message) && message.type === NcMessageTypes.PromptMultiplier);
}

// SetMultiplier

export interface NcSetMultiplierMessage extends NcBaseMessage {
  type: NcMessageTypes.SetMultiplier;
  payload: {
    multiplier: number,
  };
}

export function createNcSetMultiplierMessage(multiplier: number): NcSetMultiplierMessage {
  return {
    type: NcMessageTypes.SetMultiplier,
    payload: { multiplier },
  };
}

export function isNcSetMultiplierMessage(message: any): message is NcSetMultiplierMessage {
  return (isNcMessage(message) && message.type === NcMessageTypes.SetMultiplier);
}
