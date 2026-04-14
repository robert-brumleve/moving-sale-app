'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setItems(data);
  }

  return (
    <div>
      <h1>Items for Sale</h1>

      {items.map(item => (
        <div key={item.id} style={{ marginBottom: '20px' }}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <p>¥{item.price}</p>

          {item.image_url && (
            <img src={item.image_url} width="200" />
          )}

          <p>Status: {item.status}</p>
        </div>
      ))}
    </div>
  );
}
