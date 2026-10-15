import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
  isExternal: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  badge: { type: String, default: '' },
  children: [
    {
      label: { type: String, required: true },
      url: { type: String, required: true },
      order: { type: Number, default: 0 },
      isExternal: { type: Boolean, default: false },
      isVisible: { type: Boolean, default: true },
    },
  ],
});

const MenuSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      unique: true,
      enum: ['header', 'footer', 'quick_links'],
    },
    title: {
      type: String,
      default: '',
    },
    items: [MenuItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
