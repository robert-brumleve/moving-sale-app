'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const itemsAvailable = items.filter(item => item.status === 'available');
  const itemsSold = items.filter(item => item.status === 'sold');

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

  const ADMIN_PHONE = '816-809-5832'
  const ADMIN_EMAIL = 'lbrumleve@sbcglobal.net';
  const callAdmin = `tel:${ADMIN_PHONE}`;
  const emailAdmin = `mailto:${ADMIN_EMAIL}`;
  function getMailtoLink(item) {
    const subject = encodeURIComponent(`Interested in: ${item.title}`);
    const body = encodeURIComponent(
      `Hello,\n\nI'm interested in this item:\n\n${item.title}\n\nIs it still available?\n\nThank you`
    );

    return `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-600">
      <h1 className="text-3xl font-bold mb-6" style={{ textAlign: "center" }}>LJB Moving Sale</h1>
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <h2 className="text-xl font-semibold">Lawrence Brumleve</h2>
      <a
        href={callAdmin}
        className="inline-block mt-2 bg-green-500 text-white text-center px-4 py-2 rounded hover:bg-green-600"
      >
        Call: 816-809-5832
      </a><p></p>
      <a
        href={emailAdmin}
        className="inline-block mt-2 bg-green-500 text-white text-center px-4 py-2 rounded hover:bg-green-600"
      >
        Email: lbrumleve@sbcglobal.net
      </a>
      <h1 className="text-3xl font-bold mb-6">Payment Methods</h1>
      <p className="text-black-600 text-lg mb-2">Cash</p>
      <p className="text-black-600 text-lg mb-2">PayPal</p>
      <p className="text-black-600 text-lg mb-2">Zelle</p>
      <h1 className="text-3xl font-bold mb-6">Items Available</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {itemsAvailable.map(item => (
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

            </div>
            <a
              href={getMailtoLink(item)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition inline-block"
            >
              Email Re: {item.title}
            </a>
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
      <h1 className="text-3xl font-bold mb-6">Items Sold</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {itemsSold.map(item => (
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
              <span className="text-red-500 text-lg font-semibold">
                SOLD
              </span>
            </div>
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
