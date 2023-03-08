import React, { createContext, useEffect } from "react";
import { OnEmbeddedMessageListener, SwrveSDK } from "@swrve/web-sdk";

const KEY_NAME = 'EXTERNAL_USER_ID'

function getExternalUserId(): string {
  const externalId = localStorage.getItem(KEY_NAME);
  if (externalId) return externalId;
  const newUuid = crypto.randomUUID();
  localStorage.setItem(KEY_NAME, newUuid);
  return newUuid;
}

type IAllowedEvents = "account_status" | "button_clicked";
export interface SwrveClient {
  event: (eventName: IAllowedEvents, payload?: any) => void;
}

export const SwrveContext = createContext<SwrveClient>({
  event: () => {},
});

export const SwrveProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const embeddedbCallbackImp: OnEmbeddedMessageListener = (
      message,
      personalizationProperties
    ) => {
      console.log(
        `embedded campaign with data: ${
          message.data
        } and personalization properties: ${JSON.stringify(
          personalizationProperties
        )}`
      );
    };

    const embeddedConfig = { embeddedCallback: embeddedbCallbackImp };

    const onSwrveLoadedCallback = () => {
      console.log("SwrveSDK has been initialized");
      SwrveSDK.event("account_status");
    };

    SwrveSDK.initWithConfig(
      {
        appId: 0, //replace this with the actual appId
        apiKey: "webapikey", // replace this with the actual web api Key
        stack: "eu",
        externalUserId: getExternalUserId(),
        userVisibleOnly: true,
        autoPushSubscribe: false,
        serviceWorker: "",
        embeddedMessageConfig: embeddedConfig,
      },
      onSwrveLoadedCallback
    );
  }, []);

  const event = (eventName: IAllowedEvents, payload?: any) => {
    SwrveSDK.event(eventName, payload);
  };

  const value = {
    event,
  };

  return (
    <SwrveContext.Provider value={value}>{children}</SwrveContext.Provider>
  );
};
