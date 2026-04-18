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
        return { success: false, message: 'Image upload failed' };
      }

      const { data: urlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(data.path);

      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from('items').insert([
      {
        title: formData.title,
        description: formData.description,
        price: Number(parseFloat(formData.price).toFixed(2)),
        image_url: imageUrl
      }
    ]);

    if (error) {
      return { success: false, message: error.message };
    }

    fetchItems();

    return { success: true, message: 'Item added successfully!' };
  }

  async function updateItem(formData) {
    await supabase
      .from('items')
      .update({
        title: formData.title,
        description: formData.description,
        price: formData.price
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

    async function markAvailable(id) {
    await supabase
      .from('items')
      .update({ status: 'available' })
      .eq('id', id);

    fetchItems();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-600">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

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
        onMarkAvailable={markAvailable}
      />
    </div>
  );
  
}

