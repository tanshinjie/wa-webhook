const data = require("./backup.json");

const collection = data.__collections__.webhook;

let count = 0;
const ph = new Set();
Object.values(collection).forEach((doc) => {
  if (
    doc.data.entry &&
    doc.data.entry[0].changes &&
    doc.data.entry[0].changes[0] &&
    doc.data.entry[0].changes[0].value.messages &&
    doc.data.entry[0].changes[0].value.messages[0]
  ) {
    count++;
    let from = doc.data.entry[0].changes[0].value.messages[0].from;
    ph.add(from);
    let msg_body = doc.data.entry[0].changes[0].value.messages[0];
    console.log(`[LOG]:${count} ${from} ${JSON.stringify(msg_body)}`);
  }
});

console.log("[DEBUG] Unique phone number: ", [...ph].length);

const url = "https://graph.facebook.com/v17.0/176788205519021/messages";
const accessToken = process.env.API_ACCESS_TOKEN;

const headers = new Headers({
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
});

async function sendMessage(number, count) {
  const body = JSON.stringify({
    messaging_product: "whatsapp",
    to: number,
    type: "template",
    template: {
      name: "customer_service_unavailable",
      language: {
        code: "en",
      },
    },
  });

  const options = {
    method: "POST",
    headers: headers,
    body: body,
  };

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response:", data);
      console.log(`[SUCCESS]:${count} ${number}`);
    })
    .catch((error) => {
      console.error("Error:", error);
      console.log(`[ERROR]:${count} ${number}`);
    });
  return;
}

(async () => {
  let count = 0;
  for (const number of [...ph]) {
    count++;
    await sendMessage(number, count);
  }
})();
