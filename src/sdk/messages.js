import { request } from "./helper.js";

export const Messages = {
  listMessages: async (params) => {
    let getList = await request({
      type: "get",
      endpoint: "messages",
      params,
    });

    return getList;
  },
  sendToContact: async (data) => {
    let sendMessage = await request({
      type: "post",
      endpoint: "messages/send_to_contact",
      data,
    });

    return sendMessage;
  },
};
