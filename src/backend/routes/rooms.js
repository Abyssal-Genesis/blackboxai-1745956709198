const express = require('express');
const router = express.Router();
const { Room, Vote, User } = require('../models');
const { authenticateJWT } = require('../middleware/auth');
const { ethers } = require('ethers');
const votingContractABI = require('../contracts/VotingABI.json');
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
const wallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);
const votingContract = new ethers.Contract(process.env.VOTING_CONTRACT_ADDRESS, votingContractABI, wallet);

// Create a new room
router.post('/', authenticateJWT, async (req, res) => {
  const { name, description, isPrivate, roomKey, startTime, endTime } = req.body;
  try {
    const room = await Room.create({
      creator_id: req.user.userId,
      name,
      description,
      is_private: isPrivate,
      room_key: isPrivate ? roomKey : null,
      start_time: new Date(startTime),
      end_time: new Date(endTime),
    });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Get rooms with filters
router.get('/', authenticateJWT, async (req, res) => {
  const { status, publicOnly } = req.query;
  try {
    const now = new Date();
    let whereClause = {};
    if (status === 'active') {
      whereClause = { end_time: { [Op.gt]: now } };
    } else if (status === 'expired') {
      whereClause = { end_time: { [Op.lte]: now } };
    }
    if (publicOnly === 'true') {
      whereClause.is_private = false;
    }
    const rooms = await Room.findAll({ where: whereClause });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Delete a room
router.delete('/:roomId', authenticateJWT, async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findByPk(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.creator_id !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });
    await room.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

// Cast a vote
router.post('/:roomId/vote', authenticateJWT, async (req, res) => {
  const { roomId } = req.params;
  const { choice, roomKey } = req.body;
  try {
    const room = await Room.findByPk(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.creator_id === req.user.userId) return res.status(403).json({ error: 'Creator cannot vote' });
    if (room.is_private && room.room_key !== roomKey) return res.status(403).json({ error: 'Invalid room key' });

    const existingVote = await Vote.findOne({ where: { room_id: roomId, user_id: req.user.userId } });
    if (existingVote) return res.status(403).json({ error: 'Already voted' });

    // Interact with blockchain to cast vote
    const tx = await votingContract.castVote(roomId, choice, roomKey || '', { gasLimit: 300000 });
    await tx.wait();

    const vote = await Vote.create({
      room_id: roomId,
      user_id: req.user.userId,
      vote_choice: choice,
      blockchain_tx_hash: tx.hash,
    });

    res.json({ txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cast vote' });
  }
});

// Get voting results
router.get('/:roomId/results', authenticateJWT, async (req, res) => {
  const { roomId } = req.params;
  try {
    const votes = await Vote.findAll({ where: { room_id: roomId } });
    const results = {};
    votes.forEach(vote => {
      results[vote.vote_choice] = (results[vote.vote_choice] || 0) + 1;
    });
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

module.exports = router;
