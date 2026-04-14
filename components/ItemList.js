'use client';

export default function ItemList({ items, onEdit, onDelete, onMarkSold }) {
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
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}

            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="font-bold">¥{item.price}</p>
            <p className="text-sm">Status: {item.status}</p>

            <div className="flex gap-2 mt-3">
              <button
                className="bg-yellow-400 px-2 py-1 rounded"
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
                  Sold
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
