import { eventListeners } from "./Events";
export const dispatchEvent = async <T>(eventName: string, payload: T) => {
  const listeners = eventListeners[eventName];

  // Check if listeners exist for the event and are an array
  if (Array.isArray(listeners)) {
    await Promise.all(
      listeners.map((listener) => {
        console.log(`${eventName} is dispatching`);
        listener(payload);
        console.log(`${eventName} is dispatched`);
      })
    );
  } else {
    console.warn(`No listeners found for the event: ${eventName}`);
  }
};
