import React, { useState, useEffect } from 'react';
import {
    Pencil,
    Trash2,
    Plus,
    X,
    Search,
    Layers,
    ArrowRight,
    LayoutGrid,
    MoreVertical,
    Info,
    CheckCircle2,
    Package,
    ChevronRight,
    CornerDownRight,
    Image as ImageIcon,
    Upload
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/categories` : `http://${window.location.hostname}:5000/api/categories`;
const PRODUCTS_API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/products` : `http://${window.location.hostname}:5000/api/products`;

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [notification, setNotification] = useState(null);

    const getImageUrl = (url) => {
        if (!url) return null;
        return url.replace(/localhost|192\.168\.\d+\.\d+/, window.location.hostname).replace(':3001', ':5000');
    };

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent_id: null,
        image_url: '',
        is_featured: false
    });

    const fetchData = async (silent = false) => {
        try {
            if (!silent) setIsLoading(true);
            const [catRes, prodRes] = await Promise.all([
                fetch(API_URL),
                fetch(PRODUCTS_API)
            ]);
            const catData = await catRes.json();
            const prodData = await prodRes.json();
            setCategories(catData);
            setProducts(prodData);
        } catch (err) {
            console.error('Failed to fetch categories/products', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (category = null, parentId = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                parent_id: category.parent_id,
                image_url: category.image_url || '',
                is_featured: !!category.is_featured
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                parent_id: parentId,
                image_url: '',
                is_featured: false
            });
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalImageUrl = formData.image_url;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('image', selectedFile);

                const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
                const uploadRes = await fetch(`${API_BASE}/api/upload`, {
                    method: 'POST',
                    body: uploadData
                });

                if (uploadRes.ok) {
                    const { url } = await uploadRes.json();
                    finalImageUrl = url;
                } else {
                    console.error('Failed to upload image');
                    alert('Image upload failed.');
                    return;
                }
            }

            const method = editingCategory ? 'PUT' : 'POST';
            const url = editingCategory ? `${API_URL}/${editingCategory.id}` : API_URL;

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, image_url: finalImageUrl, is_featured: !!formData.is_featured })
            });
            fetchData(true);
            handleCloseModal();
            setNotification({ message: `Category ${editingCategory ? 'updated' : 'initialized'} successfully!`, type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (err) {
            console.error('Failed to save category', err);
            setNotification({ message: 'Failed to save category.', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleDelete = async (id) => {
        const hasSubcategories = categories.some(cat => cat.parent_id === id);
        if (hasSubcategories) {
            alert('Action blocked: This category has subcategories. Delete those first.');
            return;
        }

        if (window.confirm('Safe disposal? Note that deleting a category might disconnect its products.')) {
            try {
                const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (!res.ok) {
                    const data = await res.json();
                    alert(`Action blocked: ${data.error || 'Ensure no products are linked.'}`);
                } else {
                    fetchData(true);
                    setNotification({ message: 'Category deleted successfully!', type: 'success' });
                    setTimeout(() => setNotification(null), 3000);
                }
            } catch (err) {
                console.error('Failed to delete category', err);
                setNotification({ message: 'Failed to delete category.', type: 'error' });
                setTimeout(() => setNotification(null), 3000);
            }
        }
    };

    const countProductsPerCategory = (catId) => {
        if (!Array.isArray(products) || !Array.isArray(categories)) return 0;
        // Includes products in the category itself and its children
        const children = categories.filter(c => c.parent_id === catId).map(c => c.id);
        const allIds = [catId, ...children];
        return products.filter(p => allIds.includes(p.category_id)).length;
    };

    const parentCategories = Array.isArray(categories) ? categories.filter(c => !c.parent_id) : [];

    const filteredParents = parentCategories.filter(c =>
        (c.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        categories.some(sub => sub.parent_id === c.id && (sub.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()))
    );

    const totalCategorizedProducts = Array.isArray(products) ? products.filter(p => p.category_id).length : 0;
    const categorizationRate = (Array.isArray(products) && products.length > 0)
        ? Math.round((totalCategorizedProducts / products.length) * 100)
        : 100;

    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-6">
            {/* Notifications */}
            {notification && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 font-bold text-xs uppercase tracking-widest ${
                    notification.type === 'success' ? 'bg-emerald-900 text-white' : 'bg-red-600 text-white'
                }`}>
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                        <Info size={14} />
                    </div>
                    {notification.message}
                </div>
            )}

            {/* Page Header - Simple */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Categories</h2>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full md:w-64 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-red-600 hover:bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-lg shadow-red-100 transition-all text-xs uppercase tracking-widest"
                    >
                        <Plus size={16} strokeWidth={3} /> Add Category
                    </button>
                </div>
            </div>


            {/* Categories Architecture - Compact Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="w-10 h-10 rounded-full border-4 border-red-600/20 border-t-red-600 animate-spin mb-4"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {filteredParents && filteredParents.length > 0 ? filteredParents.map(parent => {
                        const subs = categories.filter(c => c.parent_id === parent.id);
                        const totalProducts = countProductsPerCategory(parent.id);

                        return (
                            <div key={parent.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-500">
                                {/* Parent Banner - Streamlined */}
                                <div className="p-5 pb-4 border-b border-gray-50 flex justify-between items-start bg-gray-50/20">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-100 overflow-hidden relative">
                                            {parent.image_url ? (
                                                <img src={getImageUrl(parent.image_url)} alt={parent.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <LayoutGrid size={24} />
                                            )}
                                            {parent.is_featured && (
                                                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <h3 className="text-lg font-black text-gray-900 leading-none">{parent.name}</h3>
                                                {parent.is_featured && (
                                                    <span className="text-[8px] font-black bg-green-100 text-green-600 px-1.5 py-0.5 rounded-md uppercase tracking-widest">Featured</span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-gray-400 font-medium italic line-clamp-1">{parent.description || 'Core menu section.'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => handleOpenModal(parent)} className="p-2 bg-white text-gray-400 hover:text-blue-600 rounded-xl border border-gray-100 shadow-sm transition-all active:scale-95">
                                            <Pencil size={15} />
                                        </button>
                                        <button onClick={() => handleDelete(parent.id)} className="p-2 bg-white text-gray-400 hover:text-red-600 rounded-xl border border-gray-100 shadow-sm transition-all active:scale-95">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content: Subcategories & Stats - Tighter */}
                                <div className="p-5 flex-1 space-y-6">

                                    {/* Subcategories List */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">Child Nodes</h4>
                                            <button
                                                onClick={() => handleOpenModal(null, parent.id)}
                                                className="text-[9px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1 hover:bg-red-50 px-1.5 py-0.5 rounded transition-colors"
                                            >
                                                <Plus size={10} strokeWidth={3} /> Add
                                            </button>
                                        </div>

                                        {subs.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                                                {subs.map(sub => (
                                                    <div key={sub.id} className="group/sub flex items-center justify-between p-2 bg-gray-50/30 border border-gray-50 rounded-xl hover:border-red-100 hover:bg-white transition-all">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                                                                {sub.image_url ? (
                                                                    <img src={getImageUrl(sub.image_url)} alt={sub.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <CornerDownRight size={14} className="text-gray-300" />
                                                                )}
                                                            </div>
                                                            <p className="font-bold text-gray-800 text-xs">{sub.name}</p>
                                                        </div>
                                                        <div className="flex gap-0.5 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                            <button onClick={() => handleOpenModal(sub)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                                                <Pencil size={12} />
                                                            </button>
                                                            <button onClick={() => handleDelete(sub.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-6 bg-gray-50/20 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 space-y-1">
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Empty</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-5 py-2.5 bg-gray-50/20 border-t border-gray-50 flex items-center justify-end">
                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-none">Reference ID: {parent.id}</span>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-full py-16 text-center text-gray-400">
                            No categories found match your criteria.
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        {/* Modal Header - Compact */}
                        <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-50 bg-gray-50/50 relative">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
                            <div>
                                <h3 className="text-base font-black text-gray-900 tracking-tight leading-none">
                                    {editingCategory ? 'Modify Category' : (formData.parent_id ? 'Add Branch' : 'New Parent')}
                                </h3>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                    <Layers size={9} />
                                    {formData.parent_id ? `Binding to ID #${formData.parent_id}` : 'Root Level Node'}
                                </p>
                            </div>
                            <button type="button" onClick={handleCloseModal} className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-600 transition-all active:scale-90">
                                <X size={16} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Modal Form - Tighter */}
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-8 space-y-4">
                                    <div>
                                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Entity Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all font-bold text-gray-900 text-sm placeholder:text-gray-200"
                                            placeholder="e.g. Signature Beverages"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Parent Context</label>
                                        <select
                                            value={formData.parent_id || ''}
                                            onChange={e => setFormData({ ...formData, parent_id: e.target.value ? parseInt(e.target.value) : null })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all font-bold text-gray-900 text-xs appearance-none cursor-pointer"
                                        >
                                            <option value="">Top-Level (Root)</option>
                                            {categories.filter(c => !c.parent_id && c.id !== editingCategory?.id).map(parent => (
                                                <option key={parent.id} value={parent.id}>{parent.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {!formData.parent_id && (
                                        <div className="flex items-center gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                                                className={`w-10 h-5 rounded-full relative transition-colors ${formData.is_featured ? 'bg-green-500' : 'bg-gray-200'}`}
                                            >
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${formData.is_featured ? 'left-6' : 'left-1'}`} />
                                            </button>
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Show on Home Page</span>
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-4">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Visual</label>
                                    <div className="relative aspect-square w-full rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group hover:border-red-400 transition-colors">
                                        {selectedFile || formData.image_url ? (
                                                <img
                                                    src={selectedFile ? URL.createObjectURL(selectedFile) : getImageUrl(formData.image_url)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-300">
                                                <ImageIcon size={20} />
                                                <span className="text-[8px] font-black mt-1 uppercase tracking-widest">Upload</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setSelectedFile(e.target.files[0])}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-12">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Logic/Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all font-bold text-gray-800 text-xs placeholder:text-gray-300 resize-none h-14"
                                        placeholder="Briefly define the flavor profile..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="text-gray-300 font-black text-[9px] uppercase tracking-widest hover:text-gray-900 transition-colors px-2"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-red-600 hover:bg-black text-white font-black rounded-xl transition-all shadow-lg shadow-red-100 hover:shadow-black/10 hover:-translate-y-0.5 active:translate-y-0 text-[10px] tracking-widest uppercase"
                                >
                                    {editingCategory ? 'Save' : 'Initialize'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
