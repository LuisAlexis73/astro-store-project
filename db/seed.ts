import { User, Role, db, Product, ProductImage } from "astro:db";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { seedProducts } from "./seed-data";

// https://astro.build/db/seed
export default async function seed() {
  const roles = [
    { id: "admin", name: "Admin" },
    { id: "user", name: "User" },
  ];

  const jamesJameson = {
    id: 'ABC-ID-1234', // uuid(),
    name: "James Jameson",
    email: "jamesjameson@google.com",
    password: bcrypt.hashSync("password"),
    role: "admin",
  };

  const janeDoe = {
    id: 'ABC-ID-4321', //uuid()
    name: "Jane Doe",
    email: "janedoe@google.com",
    password: bcrypt.hashSync("password"),
    role: "user",
  };

  await db.insert(Role).values(roles);
  await db.insert(User).values([jamesJameson, janeDoe]);

  const queries: any = [];

  seedProducts.forEach((prod) => {
    const product = {
      id: uuid(),
      description: prod.description,
      gender: prod.gender,
      price: prod.price,
      stock: prod.stock,
      sizes: prod.sizes.join(","),
      slug: prod.slug,
      tags: prod.tags.join(","),
      title: prod.title,
      type: prod.type,
      user: jamesJameson.id,
    };

    queries.push(db.insert(Product).values(product));

    prod.images.forEach((img) => {
      const image = {
        id: uuid(),
        image: img,
        productId: product.id,
      };

      queries.push(db.insert(ProductImage).values(image));
    });
  });

  await db.batch(queries);
}
