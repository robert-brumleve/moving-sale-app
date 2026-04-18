'use client';

import { useEffect, useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';

async function compressImage(file) {
  const options = {
    maxSizeMB: 1,          // target max size
    maxWidthOrHeight: 1200, // resize large images
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Compression error:', error);
    return file; // fallback to original
  }
}

export default function ItemForm({ onSubmit, editingItem, onCancel, isEditing }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title || '');
      setDescription(editingItem.description || '');
      setPrice(editingItem.price || '');

      // Only set preview if no new file is selected
      if (!file) {
        setPreviewUrl(editingItem.image_url || null);
      }
    } else {
      resetForm();
    }
  }, [editingItem]);

  function resetForm() {
    setTitle('');
    setDescription('');
    setPrice('');
    setFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleSubmit() {
    //  Require title
    if (!title || title.trim() === '') {
      setModalMessage('Title is required.');
      setShowModal(true);
      return;
    }
    //  Require description
    if (!description || description.trim() === '') {
      setModalMessage('Description is required.');
      setShowModal(true);
      return;
    }
    //  Require price
    if (!price) {
      setModalMessage('Price is required.');
      setShowModal(true);
      return;
    }
    //  Require image
    // Only require image when adding
    if (!isEditing && !file) {
      setModalMessage('Image is required.');
      setShowModal(true);
      return;
    }

    setLoading(true);

    let processedFile = file;

    if (file) {
      processedFile = await compressImage(file);
    }

    const result = await onSubmit({
      title,
      description,
      price,
      file: processedFile
    });

    setLoading(false);

    if (result?.success) {
      setModalMessage(result.message);
      setShowModal(true);
      resetForm();
    } else {
      setModalMessage(result?.message || 'Something went wrong');
      setShowModal(true);
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6 text-gray-600">
      <h2 className="text-xl font-semibold mb-4">
        {editingItem ? 'Edit Item' : 'Add Item'}
      </h2>

      <div className="grid gap-3">
        Title
        <input
          className="border p-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        Description
        <textarea
          className="border p-2 rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        Price
        <input
          className="border p-2 rounded"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        Image
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-40 h-40 object-cover rounded border"
          />
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            if (selectedFile) {
              const url = URL.createObjectURL(selectedFile);
              setPreviewUrl(url);
            }
          }}
        />

        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : (editingItem ? 'Update' : 'Add')}
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
      
    </div>
  );
}
