const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

const serviceAccount = require("./admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();

const User = db.collection("users");

const Product = db.collection("products");

const Cart = db.collection("carts");

const Order = db.collection("orders");

// Upload images function for firebase storage
const uploadImage = async ({ file, path }) => {
  const bucket = admin.storage().bucket();

  const { originalname, buffer } = file;

  const fileName = `${path}/${uuidv4()}-${originalname}`;

  const fileUpload = bucket.file(fileName);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on("error", (error) => {
    console.log(error);
  });

  blobStream.on("finish", () => {
    console.log("Image uploaded to bucket");
  });

  blobStream.end(buffer);

  return `https://firebasestorage.googleapis.com/v0/b/${
    bucket.name
  }/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
};

module.exports = {
  User,
  Product,
  Cart,
  Order,
  uploadImage,
};
