return (
  <div className="bg-white p-6 rounded-2xl shadow mb-6">
    <h2 className="text-xl font-semibold mb-4">
      {editingItem ? 'Edit Item' : 'Add Item'}
    </h2>

    <div className="grid gap-3">
      <input
        className="border p-2 rounded"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 rounded"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <input
        className="border p-2 rounded"
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
      />

      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          {editingItem ? 'Update' : 'Add'}
        </button>

        {editingItem && (
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  </div>
);
