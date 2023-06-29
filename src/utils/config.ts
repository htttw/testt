require("custom-env").env(process.env.NODE_ENV);

const config:any = {
  env: process.env.ENV,
  apiKey: process.env.API_KEY,
  secret:  process.env.SECRET,
  apiPort: parseInt(process.env.API_PORT || "0"),
  serverElParron: process.env.API_ELPARRON,
  apiKeyElParron: process.env.APIKEY_ELPAROON,
};

export default config;
