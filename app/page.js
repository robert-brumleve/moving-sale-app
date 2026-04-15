'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    setItems(data || []);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
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
                className="w-full h-48 object-cover rounded-xl mb-3"
              />
            )}

            <h2 className="text-xl font-semibold">{item.title}</h2>

            <p className="text-gray-600 text-sm mb-2">
              {item.description}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                ${item.price?.toFixed(2)}
              </span>

              {item.status === 'sold' && (
                <span className="text-red-500 text-sm font-semibold">
                  SOLD
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
