import "dotenv/config";
import { Messages } from "./sdk/messages.js";
import { Contacts } from "./sdk/contacts.js";

/* MENSAJES */

const testListMessages = async (params) => {
  try {
    console.log("1. Init testListMessages");

    const response = await Messages.listMessages(params);

    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

testListMessages({
  limit: 5,
  direction: "MT",
  start_date: "2022-01-01 00:00:00",
  end_date: "2022-01-02 00:00:00",
  //msisdn: 50612345678,
});

const testSendMessage = async (body) => {
  try {
    console.log("1. Init testSendMessage");
    const response = await Messages.sendToContact(body);

    console.log(response.data);
  } catch (error) {
    console.log(error.response);
  }
};
/* testSendMessage({
  msisdn: "50612345678",
  message: "Test sms",
  id: 1,
});
 */

/* CONTACTOS */

const testListContacts = async (params) => {
  try {
    console.log("1. Init testListConacts");

    const response = await Contacts.listContacts(params);

    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};

//testListContacts({limit:5})
