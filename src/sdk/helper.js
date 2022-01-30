import axios from "axios";
import crypto from "crypto";
import { sortParams } from "./lib/sortParams.js";
import { config } from "./config/dotenv.js";

const authorization = (config) => {
  console.log("2. Authorization");

  const auth = {};
  let formattedParams = "";
  let formattedData = "";
  const formattedDate = new Date().toUTCString();

  if (!config.apiKey || !config.apiSecret == null) return "Keys are nedded!";

  if (config.data) formattedData = JSON.stringify(config.data);

  if (config.params)
    formattedParams = Object.keys(sortParams(config.params))
      .map(
        (key) =>
          key + "=" + encodeURIComponent(config.params[key]).replace(/%20/g, "+")
      )
      .join("&");

  const canonicalString = `${config.apiKey}${formattedDate}${formattedParams}${formattedData}`;

  const sign = crypto
    .createHmac("sha1", config.apiSecret)
    .update(canonicalString)
    .digest("base64");

  console.log({ formattedData, formattedParams, canonicalString, sign });

  auth.Date = `${formattedDate}`;
  auth.Authorization = `IM ${config.apiKey}:${sign}`;

  console.log(auth);

  return auth;
};

export const request = (data) => {
  if (data.params) config.params = data.params;
  if (data.data) config.data = data.data;

  const auth = authorization(config);

  console.log("3. Send request");
  return axios({
    method: data.type,
    url: `${config.url}${data.endpoint}`,
    data: data.data,
    params: data.params,
    headers: {
      Date: auth.Date,
      Authorization: auth.Authorization,
    },
  });
};
