'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import ItemForm from '../../../components/ItemForm';
import ItemList from '../../../components/ItemList.js';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // -------------------------
  // INIT
  // -------------------------
  useEffect(() => {
    checkUser();
    fetchItems();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) window.location.href = '/admin/login';
  }

  async function fetchItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setItems(data);
  }

  // -------------------------
  // CRUD OPERATIONS
  // -------------------------
  async function addItem(formData) {
    let imageUrl = null;

    if (formData.file) {
      const fileName = `${Date.now()}-${formData.file.name}`;

      const { data, error } = await supabase.storage
        .from('item-images')
        .upload(`public/${fileName}`, formData.file);

      if (error) {
        alert('Image upload failed');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(data.path);

      imageUrl = urlData.publicUrl;
    }

    await supabase.from('items').insert([
      {
        title: formData.title,
        description: formData.description,
        price: formData.price ? Number(formData.price) : null,
        image_url: imageUrl
      }
    ]);

    fetchItems();
  }

  async function updateItem(formData) {
    await supabase
      .from('items')
      .update({
        title: formData.title,
        description: formData.description,
        price: formData.price ? Number(formData.price) : null
      })
      .eq('id', editingItem.id);

    setEditingItem(null);
    fetchItems();
  }

  async function deleteItem(id) {
    if (!confirm('Delete this item?')) return;

    await supabase.from('items').delete().eq('id', id);
    fetchItems();
  }

  async function markSold(id) {
    await supabase
      .from('items')
      .update({ status: 'sold' })
      .eq('id', id);

    fetchItems();
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      <ItemForm
        onSubmit={editingItem ? updateItem : addItem}
        editingItem={editingItem}
        onCancel={() => setEditingItem(null)}
      />

      <ItemList
        items={items}
        onEdit={setEditingItem}
        onDelete={deleteItem}
        onMarkSold={markSold}
      />
    </div>
  );
}
