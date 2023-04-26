import { IProduct } from '@/interfaces';
import mongoose, { Schema, model, Model } from 'mongoose';

const ProductSchema = new Schema({
  description: { type: String, required: true, default: '' },
  images: [{ type: String }],
  inStock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  sizes: [{
    type: String,
    enum: {
      values: ['XS','S','M','L','XL','XXL','XXXL'],
      message: '{VALUE} no es un tamaño válido.'
    }
  }],
  slug: { type: String, required: true, unique: true },
  tags: [{ type: String }],
  title: { type: String, required: true, default: '' },
  type: [{
    type: String,
    enum: {
      values: ['shirts','pants','hoodies','hats'],
      message: '{VALUE} no es un tipo válido.'
    },
    default: 'shirts'
  }],
  gender: [{
    type: String,
    enum: {
      values: ['men','women','kid','unisex'],
      message: '{VALUE} no es un género válido.'
    },
    default: 'women'
  }],
}, {
  timestamps: true
});

// Indice de Mongo para busquedas
ProductSchema.index({ title: 'text', tags: 'text' });

const Product:Model<IProduct> = mongoose.models.Product || model('Product', ProductSchema);

export default Product;