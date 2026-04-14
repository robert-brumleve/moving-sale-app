'use client';

import { useEffect, useState } from 'react';

export default function ItemForm({ onSubmit, editingItem, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);

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

  function handleSubmit() {
    onSubmit({
      title,
      description,
      price,
      file
    });

    if (!editingItem) resetForm();
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2>{editingItem ? 'Edit Item' : 'Add Item'}</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <br />

      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
      />
      <br />

      <button onClick={handleSubmit}>
        {editingItem ? 'Update Item' : 'Add Item'}
      </button>

      {editingItem && (
        <button onClick={onCancel}>Cancel</button>
      )}
    </div>
  );
}
