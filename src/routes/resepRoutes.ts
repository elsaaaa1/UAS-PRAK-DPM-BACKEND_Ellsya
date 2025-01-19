import express, { Request, Response } from 'express';
import { Resep } from '../models/Resep';
import authenticateToken from '../middleware/authenticateToken';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const reseps = await Resep.find({ userId });
    res.json(reseps);
  } catch (err) {
    console.error('Error fetching resep:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, bahan, langkah } = req.body;
  const userId = req.userId;

  if (!name || !bahan || !langkah) {
    res.status(400).json({ error: 'Name, Bahan, and Langkah are required' });
    return;
  }

  try {
    const newResep = new Resep({ name, bahan, langkah, userId });
    await newResep.save();
    res.status(201).json(newResep);
  } catch (err) {
    console.error('Error saving resep:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, bahan, langkah } = req.body;
  const userId = req.userId;

  if (!name || !bahan || !langkah) {
    res.status(400).json({ error: 'Name, Bahan, and Langkah are required' });
    return;
  }

  try {
    const updatedResep = await Resep.findOneAndUpdate(
      { _id: id, userId },
      { name, bahan, langkah },
      { new: true }
    );

    if (!updatedResep) {
      res.status(404).json({ error: 'Resep not found or unauthorized' });
      return;
    }

    res.json(updatedResep);
  } catch (err) {
    console.error('Error updating resep:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const resep = await Resep.findOneAndDelete({ _id: id, userId });
    if (!resep) {
      res.status(404).json({ error: 'Resep not found or unauthorized' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting resep:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;