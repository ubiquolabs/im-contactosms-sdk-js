import { request } from "./helper.js";

export const Contacts = {
  listContacts: async (params) => {
    let getList = await request({
      type: "get",
      endpoint: "contacts",
      params,
    });

    return getList;
  },
};
