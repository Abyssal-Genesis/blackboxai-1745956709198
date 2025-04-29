import React, { useState } from 'react';
import axios from 'axios';

const RoomCreate = ({ token }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomKey, setRoomKey] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/rooms', {
        name,
        description,
        isPrivate,
        roomKey: isPrivate ? roomKey : null,
        startTime,
        endTime,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Room created successfully!');
    } catch (error) {
      setMessage('Failed to create room.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Create Voting Room</h2>
      <label className="block mb-2 text-gray-700 dark:text-gray-300">Room Name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 mb-4 border rounded" />
      <label className="block mb-2 text-gray-700 dark:text-gray-300">Description</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 mb-4 border rounded" />
      <label className="block mb-2 text-gray-700 dark:text-gray-300">
        <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
        {' '}Private Room
      </label>
      {isPrivate && (
        <>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">Room Key</label>
          <input type="password" value={roomKey} onChange={e => setRoomKey(e.target.value)} required className="w-full p-2 mb-4 border rounded" />
        </>
      )}
      <label className="block mb-2 text-gray-700 dark:text-gray-300">Start Time</label>
      <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full p-2 mb-4 border rounded" />
      <label className="block mb-2 text-gray-700 dark:text-gray-300">End Time</label>
      <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required className="w-full p-2 mb-4 border rounded" />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Create Room</button>
      {message && <p className="mt-4 text-center text-gray-700 dark:text-gray-300">{message}</p>}
    </form>
  );
};

export default RoomCreate;
