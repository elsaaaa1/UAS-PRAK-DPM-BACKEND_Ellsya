import mongoose from 'mongoose';

const resepSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bahan: {
    type: String,
    required: true,
  },
  langkah: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export const Resep = mongoose.model('Resep', resepSchema);