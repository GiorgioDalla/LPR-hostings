import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  try {
    const mongoClient = await clientPromise;
    console.log("Just connected !");
    const db = mongoClient.db("AddressAndSignature");
    const collection = db.collection("Users");
    const results = await collection.find({}).toArray();
    response.status(200).json(results);
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
}
