'use client';

export default function ItemList({ items, onEdit, onDelete, onMarkSold }) {
  return (
    <div>
      <h2>Items</h2>

      {items.map(item => (
        <div
          key={item.id}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '15px'
          }}
        >
          <h3>{item.title}</h3>

          <p>{item.description}</p>
          <p>¥{item.price}</p>
          <p>Status: {item.status}</p>

          {item.image_url && (
            <img src={item.image_url} width="150" />
          )}

          <br />

          <button onClick={() => onEdit(item)}>Edit</button>
          <button onClick={() => onDelete(item.id)}>Delete</button>

          {item.status !== 'sold' && (
            <button onClick={() => onMarkSold(item.id)}>
              Mark as Sold
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
