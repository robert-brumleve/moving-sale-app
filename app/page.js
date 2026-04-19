'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
  function handleKey(e) {
    if (e.key === 'Escape') {
      setSelectedImage(null);
    }
  }

  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
}, []);

  async function fetchItems() {
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    setItems(data || []);
  }

  const ADMIN_EMAIL = 'bob.brumleve@gmail.com';
  function getMailtoLink(item) {
    const subject = encodeURIComponent(`Interested in: ${item.title}`);
    const body = encodeURIComponent(
      `Hi,\n\nI'm interested in this item:\n\n${item.title}\n\nIs it still available?\n\nThanks`
    );

    return `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-600">
      <h1 className="text-3xl font-bold mb-6">Items for Sale</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow p-4"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                className="w-full h-40 object-contain rounded mb-2 cursor-pointer"
                onClick={() => setSelectedImage(item.image_url)}
              />
            )}

            <h2 className="text-xl font-semibold">{item.title}</h2>

            <p className="text-black-600 text-sm mb-2">
              {item.description}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                {item.price}
              </span>

              {item.status === 'sold' && (
                <span className="text-red-500 text-lg font-semibold">
                  SOLD
                </span>
              )}
            </div>
            {item.status != 'sold' && (
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => getMailtoLink(item)}
              >
                Contact Seller
              </button>
            )}
          </div>
        ))}
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
  );
}
