import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/categories';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const fetchCategories = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingCategory ? 'PUT' : 'POST';
            const url = editingCategory ? `${API_URL}/${editingCategory.id}` : API_URL;

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            fetchCategories();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save category', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? (This might fail if products are linked)')) {
            try {
                const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (!res.ok) {
                    const data = await res.json();
                    alert(`Failed to delete: ${data.error || 'Check if products are linked to this category.'}`);
                } else {
                    fetchCategories();
                }
            } catch (err) {
                console.error('Failed to delete category', err);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-colors"
                >
                    <Plus size={20} /> Add Category
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100 text-sm">
                        <tr>
                            <th className="p-4 font-semibold w-16 text-center">ID</th>
                            <th className="p-4 font-semibold">Category Name</th>
                            <th className="p-4 font-semibold">Description</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 text-center font-mono text-gray-400 text-sm">#{c.id}</td>
                                <td className="p-4 font-bold text-gray-900">{c.name}</td>
                                <td className="p-4 text-gray-500 max-w-sm truncate whitespace-normal">{c.description || <span className="italic opacity-50">No description</span>}</td>
                                <td className="p-4 flex items-center justify-end gap-2">
                                    <button onClick={() => handleOpenModal(c)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(c.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-gray-500 italic">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                            <button type="button" onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-shadow" placeholder="e.g. Beverages" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (Optional)</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-shadow resize-none" rows="4" placeholder="Briefly describe what goes into this category..."></textarea>
                            </div>

                            <div className="mt-4 pt-6 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                                    {editingCategory ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
