const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccount.json");
const fs = require("fs");

admin.initializeApp({
  credential: require("firebase-admin").credential.cert(serviceAccount),
});

async function getData() {
  const db = firestore.getFirestore();
  const collectionRef = db.collection("webhooks");

  const snapshot = await collectionRef.get();
  let data = [];
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    data.push(doc.data());
  });
  return data;
  // const snapshot = await firebase.firestore().collection("webhooks").get();
  // return snapshot.docs.map((doc) => doc.data());
}

(async () => {
  const data = await getData();
  console.log("[DEBUG] data", data);
  fs.writeFileSync("data.json", JSON.stringify(data));
})();
