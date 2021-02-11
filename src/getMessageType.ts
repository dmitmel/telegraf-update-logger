import * as tg from "typegram";

// No comment. See <https://stackoverflow.com/a/49402091/12005228>.
type KeysOfUnion<T> = T extends T ? keyof T : never;

function getMessageType(msg: tg.Message): string | undefined {
  return getMessageType.MESSAGE_TYPES.find((type) => type in msg);
}

namespace getMessageType {
  export const MESSAGE_TYPES: ReadonlyArray<KeysOfUnion<tg.Message>> = [
    "animation",
    "audio",
    "connected_website",
    "contact",
    "dice",
    "document",
    "game",
    "invoice",
    "location",
    "passport_data",
    "photo",
    "pinned_message",
    "poll",
    "proximity_alert_triggered",
    "sticker",
    "successful_payment",
    "text",
    "venue",
    "video",
    "video_note",
    "voice",
  ];
}

export = getMessageType;
