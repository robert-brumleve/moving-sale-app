'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { arrayMove } from '@dnd-kit/sortable';
import {
  DndContext,
  closestCenter
} from '@dnd-kit/core';

import {
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ item, onEdit, onDelete, onMarkSold, onMarkAvailable, setSelectedImage }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 rounded-2xl shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab mb-2 text-gray-400">
        ☰ Drag
      </div>

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

      <div className="flex gap-2 mt-3 flex-wrap">
        <button className="bg-yellow-400 text-white px-2 py-1 rounded" onClick={() => onEdit(item)}>Edit</button>
        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDelete(item.id)}>Delete</button>

        {item.status !== 'sold' && (
          <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => onMarkSold(item.id)}>
            Mark Sold
          </button>
        )}

        {item.status !== 'available' && (
          <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => onMarkAvailable(item.id)}>
            Mark Available
          </button>
        )}
      </div>
    </div>
  );
}

export default function ItemList({ items, setItems, onEdit, onDelete, onMarkSold, onMarkAvailable }) {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setSelectedImage(null);
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    await Promise.all(
      newItems.map((item, index) =>
        supabase.from('items').update({ position: index }).eq('id', item.id)
      )
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Items</h2>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map(item => item.id)}
          strategy={rectSortingStrategy} // ✅ grid-friendly
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <SortableItem
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onMarkSold={onMarkSold}
                onMarkAvailable={onMarkAvailable}
                setSelectedImage={setSelectedImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Lightbox OUTSIDE map */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 bg-black bg-opacity-70 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg"
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
  );
}
