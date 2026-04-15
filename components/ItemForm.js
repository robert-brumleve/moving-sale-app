'use client';

import { useEffect, useState } from 'react';

export default function ItemForm({ onSubmit, editingItem, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title || '');
      setDescription(editingItem.description || '');
      setPrice(editingItem.price || '');
    } else {
      resetForm();
    }
  }, [editingItem]);

  function resetForm() {
    setTitle('');
    setDescription('');
    setPrice('');
    setFile(null);
  }

  async function handleSubmit() {
    setLoading(true);

    const result = await onSubmit({
      title,
      description,
      price,
      file
    });

    setLoading(false);

    if (result?.success) {
      setModalMessage(result.message);
      setShowModal(true);
      resetForm(); // ✅ only on success
    } else {
      setModalMessage(result?.message || 'Something went wrong');
      setShowModal(true);
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingItem ? 'Edit Item' : 'Add Item'}
      </h2>

      <div className="grid gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />

        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            {editingItem ? 'Update' : 'Add'}
          </button>

          {editingItem && (
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <p className="mb-4">{modalMessage}</p>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Processing...' : (editingItem ? 'Update' : 'Add')}
      </button>
    </div>
  );
}
