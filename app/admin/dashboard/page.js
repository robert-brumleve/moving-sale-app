'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import ItemForm from '../../../components/ItemForm';
import ItemList from '../../../components/ItemList.js';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [globalMessage, setGlobalMessage] = useState('');
  const [showGlobalModal, setShowGlobalModal] = useState(false);

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
      .order('position', { ascending: true })

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
        price: (formData.price),
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
    let imageUrl = editingItem.image_url;

    // ✅ If user selected a new image
    if (formData.file) {
      const fileName = `${Date.now()}-${formData.file.name}`;

      const { data, error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(`public/${fileName}`, formData.file);

      if (uploadError) {
        console.error(uploadError);
        return { success: false, message: 'Image upload failed' };
      }

      const { data: urlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(data.path);

      imageUrl = urlData.publicUrl;

      // 🔥 Optional: delete old image
      if (editingItem.image_url) {
        const path = editingItem.image_url.split('/item-images/')[1];

        await supabase.storage
          .from('item-images')
          .remove([path]);
      }
    }

    // ✅ Update DB
    const { error } = await supabase
      .from('items')
      .update({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        image_url: imageUrl
      })
      .eq('id', editingItem.id);

    if (error) {
      console.error(error);
      return { success: false, message: error.message };
    }

    await fetchItems();

    return { success: true, message: 'Item updated successfully!' };
  }

  async function deleteItem(id) {
    if (!confirm('Delete this item?')) return;

    // 1. Get the item first
    const { data: item, error: fetchError } = await supabase
      .from('items')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      alert('Failed to fetch item');
      return;
    }

    // 2. Delete image from storage (if exists)
    if (item?.image_url) {
      // Example URL:
      // https://xxx.supabase.co/storage/v1/object/public/item-images/public/filename.jpg

      const path = item.image_url.split('/object/public/item-images/')[1];

      if (path) {
        const { error: storageError } = await supabase.storage
          .from('item-images')
          .remove([path]);

        if (storageError) {
          console.error('Storage delete failed:', storageError);
        }
      }
    }

    // 3. Delete DB row
    const { error: deleteError } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (deleteError) {
      alert('Failed to delete item');
      return;
    }

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
        onSubmit={addItem}
        editingItem={false}   // force add mode
      />

      <ItemList
        items={items}
        setItems={setItems}
        onEdit={(item) => {
          setEditingItem(item);
          setShowEditModal(true);
        }}
        onDelete={deleteItem}
        onMarkSold={markSold}
        onMarkAvailable={markAvailable}
      />
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg relative">

            <button
              className="absolute top-3 right-3 text-gray-500"
              onClick={() => {
                setShowEditModal(false);
                setEditingItem(null);
              }}
            >
              ✕
            </button>

            <ItemForm
              editingItem={editingItem}
              isEditing={true}
              onSubmit={async (formData) => {
                const result = await updateItem(formData);

                if (result.success) {
                  setGlobalMessage(result.message);
                  setShowGlobalModal(true);

                  setEditingItem(null);
                  setShowEditModal(false);
                }

                return result;
              }}
              onCancel={() => {
                setEditingItem(null);
                setShowEditModal(false);
              }}
            />
          </div>
        </div>
      )}
      {showGlobalModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <p className="mb-4">{globalMessage}</p>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowGlobalModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
