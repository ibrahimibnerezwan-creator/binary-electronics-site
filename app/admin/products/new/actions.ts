'use server'

import { db } from '@/db';
import { products, productImages } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: any) {
  try {
    const id = uuidv4();
    const name = formData.get('name');
    const slug = name.toLowerCase().replace(/[^a-z0-0]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + id.slice(0, 4);
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const comparePrice = formData.get('comparePrice') ? parseFloat(formData.get('comparePrice')) : null;
    const stock = parseInt(formData.get('stock'));
    const categoryId = formData.get('categoryId') === 'Select Category' ? null : formData.get('categoryId');
    const brandId = formData.get('brandId') === 'Select Brand' ? null : formData.get('brandId');
    const sku = formData.get('sku');
    const isFeatured = formData.get('isFeatured') === 'true';
    
    // Specs would ideally be JSON
    const specs: any = {};
    // Extracting some common specs if provided (this part can be expanded)

    await db.insert(products).values({
      id,
      name,
      slug,
      description,
      price,
      comparePrice,
      stock,
      categoryId,
      brandId,
      sku,
      isFeatured,
      specs: JSON.stringify(specs),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Handle images
    const imagesJson = formData.get('images');
    if (imagesJson) {
      const urls = JSON.parse(imagesJson);
      if (Array.isArray(urls)) {
        const imageInserts = urls.map((url, index) => ({
          id: uuidv4(),
          url,
          productId: id,
          sortOrder: index,
        }));
        
        if (imageInserts.length > 0) {
          await db.insert(productImages).values(imageInserts);
        }
      }
    }

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin/products');

    return { success: true, productId: id };
  } catch (error: any) {
    console.error('Create product error:', error);
    return { success: false, error: error.message || 'Failed to create product' };
  }
}
