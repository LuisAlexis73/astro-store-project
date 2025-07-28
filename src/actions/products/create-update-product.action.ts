import { ImageUpload } from "@/utils/image-upload";
import { defineAction } from "astro:actions";
import { db, eq, Product, ProductImage } from "astro:db";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";
import { v4 as uuid } from 'uuid';

const MAX_FILE_SIZE = 5_000_000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

export const createUpdateProduct = defineAction({
  accept: 'form',
  input: z.object({
    id: z.string().optional(),
    description: z.string().min(1, { message: "Description is required" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    gender: z.string(),
    sizes: z.string(),
    slug: z.string(),
    stock: z.number(),
    tags: z.string(),
    title: z.string(),
    type: z.string(),

    imageFiles: z.array(
      z.instanceof(File).refine(file => file.size <= MAX_FILE_SIZE, 'Max image size 5MB').refine(file => {
        if (file.size === 0) return true;

        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      }, `Only supported image files are valid, ${ACCEPTED_IMAGE_TYPES.join(', ')}`),
    ).optional(),
  }),
  handler: async (form, { request }) => {
    try {

      const session = await getSession(request);
      const user = session?.user;

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { id = uuid(), imageFiles, ...rest } = form;
      rest.slug = rest.slug.toLowerCase().replaceAll(' ', '-').trim();

      const product = {
        id: id,
        user: user.id!,
        ...rest,
      }

      const queries: any = [];

      if (!form.id) {
        queries.push(db.insert(Product).values(product));
      } else {
        queries.push(db.update(Product).set(product).where(eq(Product.id, id)));
      }

      const secureUrls: string[] = [];

      if (form.imageFiles && form.imageFiles.length > 0 && form.imageFiles[0].size > 0) {
        const urls = await Promise.all(
          form.imageFiles.map(file => ImageUpload.uploadImage(file))
        );

        secureUrls.push(...urls);
      }

      secureUrls.forEach(imageUrl => {
        const imageObj = {
          id: uuid(),
          image: imageUrl,
          productId: product.id,
        }

        queries.push(db.insert(ProductImage).values(imageObj));
      })

      await db.batch(queries);

      return product;

    } catch (error) {
      console.error("Error in createUpdateProduct action:", error);
      throw new Error("An error occurred while processing the request.");
    }
  },
})