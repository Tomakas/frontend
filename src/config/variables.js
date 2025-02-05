let nodeEnv = process.env.NODE_ENV;
//nodeEnv="noBackend"

export const baseURL = nodeEnv === "development"?'http://localhost:8080':'https://api.elementarypos.com';
export const websocketURL = nodeEnv === "development"?'ws://localhost:8080':'wss://api.elementarypos.com';




