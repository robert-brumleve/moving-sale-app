'use client';

import { useEffect, useState } from 'react';

export default function ItemList({ items, onEdit, onDelete, onMarkSold, onMarkAvailable }) {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Items</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-2xl shadow"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                className="w-full h-40 object-contain rounded mb-2 cursor-pointer"
                onClick={() => setSelectedImage(item.image_url)}
              />
            )}

            <h3 className="font-semibold text-gray-600">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="font-bold text-gray-600">{item.price}</p>
            <p className="text-sm text-gray-600">Status: {item.status}</p>

            <div className="flex gap-2 mt-3">
              <button
                className="bg-yellow-400 text-white px-2 py-1 rounded"
                onClick={() => onEdit(item)}
              >
                Edit
              </button>

              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </button>

              {item.status !== 'sold' && (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => onMarkSold(item.id)}
                >
                  Mark as Sold
                </button>
              )}

              {item.status !== 'available' && (
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => onMarkAvailable(item.id)}
                >
                  Mark as Available
                </button>
              )}
              {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                  <button
                    className="absolute top-4 right-4 bg-black bg-opacity-70 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-opacity-90 transition"
                    onClick={() => setSelectedImage(null)}
                  >
                    ✕
                  </button>

                  <img
                    src={selectedImage}
                    className="max-w-full max-h-full rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
