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

const API_URL = 'http://localhost:3001/api/categories';
const PRODUCTS_API = 'http://localhost:3001/api/products';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent_id: null,
        image_url: ''
    });

    const fetchData = async () => {
        try {
            setIsLoading(true);
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
                image_url: category.image_url || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                parent_id: parentId,
                image_url: ''
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

                const uploadRes = await fetch('http://localhost:3001/api/upload', {
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
                body: JSON.stringify({ ...formData, image_url: finalImageUrl })
            });
            fetchData();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save category', err);
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
                    fetchData();
                }
            } catch (err) {
                console.error('Failed to delete category', err);
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
        <div className="space-y-6">
            {/* Page Header - Compact */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-red-600 mb-1">
                        <Layers size={14} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Hierarchy</span>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Structured Menu</h2>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search hierarchy..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full md:w-64 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-red-600 hover:bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-sm transition-all text-xs uppercase tracking-wide"
                    >
                        <Plus size={16} strokeWidth={3} /> Add Parent
                    </button>
                </div>
            </div>

            {/* Metrics Dashboard - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Parent Groups</p>
                        <h4 className="text-xl font-black text-gray-900">{parentCategories.length} Categories</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                        <LayoutGrid size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sub-Sections</p>
                        <h4 className="text-xl font-black text-gray-900">{categories.length - parentCategories.length} Subcategories</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Layers size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Categorization</p>
                        <h4 className="text-xl font-black text-green-600">{categorizationRate}% Items</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                    </div>
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
                                        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-100 overflow-hidden">
                                            {parent.image_url ? (
                                                <img src={parent.image_url} alt={parent.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <LayoutGrid size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 leading-none mb-1.5">{parent.name}</h3>
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
                                    {/* Stats Row */}
                                    <div className="flex gap-3">
                                        <div className="flex-1 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100 flex items-center justify-between">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Subs</p>
                                            <span className="text-sm font-black text-gray-900">{subs.length}</span>
                                        </div>
                                        <div className="flex-1 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100 flex items-center justify-between">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Items</p>
                                            <span className="text-sm font-black text-gray-900">{totalProducts}</span>
                                        </div>
                                    </div>

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
                                                                    <img src={sub.image_url} alt={sub.name} className="w-full h-full object-cover" />
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
                                </div>

                                <div className="col-span-4">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Visual</label>
                                    <div className="relative aspect-square w-full rounded-2xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group hover:border-red-400 transition-colors">
                                        {selectedFile || formData.image_url ? (
                                            <img
                                                src={selectedFile ? URL.createObjectURL(selectedFile) : formData.image_url}
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
                                    {editingCategory ? 'Commit' : 'Initialize'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
