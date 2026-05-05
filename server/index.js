import express from 'express';
import cors from 'cors';
import { storeProof } from './blockchain.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/store-proof', async (req, res) => {
  const { deviceId, beforeHash, afterHash, status } = req.body;

  if (!deviceId || !beforeHash || !afterHash || !status) {
    return res.status(400).json({ success: false, error: "Missing required proof data." });
  }

  const result = await storeProof({ deviceId, beforeHash, afterHash, status });

  if (result.success) {
    res.json({ success: true, txHash: result.txHash });
  } else {
    res.status(500).json({ success: false, error: result.error || "Blockchain anchoring failed" });
  }
});

app.listen(PORT, () => {
  console.log(`DATA ECLIPSE blockchain backend running on port ${PORT}`);
});
