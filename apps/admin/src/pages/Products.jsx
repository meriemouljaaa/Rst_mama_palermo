import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Toast from '../components/Toast';
import { Pencil, Trash2, Plus, X, Image as ImageIcon, Upload, Tag, AlignLeft, Info, DollarSign, Filter, ChevronDown, Search } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/products` : `http://${window.location.hostname}:5000/api/products`;
const CATEGORY_API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/categories` : `http://${window.location.hostname}:5000/api/categories`;

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        is_available: true,
        variants: [],
        removable_ingredients: []
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const getImageUrl = (url) => {
        if (!url) return null;
        return url.replace(/localhost|192\.168\.\d+\.\d+/, window.location.hostname).replace(':3001', ':5000');
    };

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(API_URL),
                fetch(CATEGORY_API_URL)
            ]);
            setProducts(await prodRes.json());
            setCategories(await catRes.json());
        } catch (err) {
            console.error('Failed to fetch data', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                category_id: product.category_id || '',
                image_url: product.image_url || '',
                is_available: product.is_available,
                variants: product.variants || [],
                removable_ingredients: product.removable_ingredients || []
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category_id: categories.length > 0 ? categories[0].id : '', image_url: '', is_available: true, variants: [], removable_ingredients: [] });
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { name: '', price: '' }]
        }));
    };

    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const updateVariant = (index, field, value) => {
        setFormData(prev => {
            const newVariants = [...prev.variants];
            newVariants[index] = { ...newVariants[index], [field]: value };
            return { ...prev, variants: newVariants };
        });
    };

    const addIngredient = (name) => {
        if (!name.trim()) return;
        if (formData.removable_ingredients.includes(name.trim())) return;
        setFormData(prev => ({
            ...prev,
            removable_ingredients: [...prev.removable_ingredients, name.trim()]
        }));
    };

    const removeIngredient = (name) => {
        setFormData(prev => ({
            ...prev,
            removable_ingredients: prev.removable_ingredients.filter(i => i !== name)
        }));
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalImageUrl = formData.image_url;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('image', selectedFile);

                const uploadRes = await fetch(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}/api/upload`, {
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

            const method = editingProduct ? 'PUT' : 'POST';
            const url = editingProduct ? `${API_URL}/${editingProduct.id}` : API_URL;

            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                category: formData.category_id,
                image_url: finalImageUrl
            };

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...payload,
                    variants: formData.variants.map(v => ({ ...v, price: parseFloat(v.price) }))
                })
            });
            fetchData();
            handleCloseModal();
            setNotification({ message: `Product ${editingProduct ? 'updated' : 'created'} successfully!`, type: 'success' });
            setTimeout(() => setNotification(null), 3000);
        } catch (err) {
            console.error('Failed to save product', err);
            setNotification({ message: 'Failed to save product.', type: 'error' });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const toggleAvailability = async (product) => {
        try {
            const newStatus = !product.is_available;
            const res = await fetch(`${API_URL}/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...product,
                    is_available: newStatus,
                    category: product.category_id // Backend expects 'category' not 'category_id'
                })
            });

            if (res.ok) {
                setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_available: newStatus } : p));
                setNotification({ message: `Product marked as ${newStatus ? 'available' : 'out of stock'}`, type: 'success' });
                setTimeout(() => setNotification(null), 2000);
            }
        } catch (err) {
            console.error('Failed to toggle availability', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                fetchData();
                setNotification({ message: 'Product deleted successfully!', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
            } catch (err) {
                console.error('Failed to delete product', err);
                setNotification({ message: 'Failed to delete product.', type: 'error' });
                setTimeout(() => setNotification(null), 3000);
            }
        }
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id?.toString() === id?.toString());
        return cat ? cat.name : 'Uncategorized';
    };

    const filteredProducts = products.filter(p => {
        // 1. Search filter
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (!matchesSearch) return false;

        // 2. Category filter
        if (selectedCategory === 'all') return true;
        
        const productCatId = p.category_id?.toString();
        if (productCatId === selectedCategory.toString()) return true;

        // Also include products from subcategories
        const productCat = categories.find(c => c.id?.toString() === productCatId);
        return productCat?.parent_id?.toString() === selectedCategory.toString();
    });

    useEffect(() => {
        console.log(`[Admin] Filtering by main category: ${selectedCategory}`);
    }, [selectedCategory]);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Notifications */}
            {notification && createPortal(
                <Toast 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={() => setNotification(null)} 
                />,
                document.body
            )}

            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-[#F8F9FA] pb-6 shrink-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Products</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage your menu catalog</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
                            />
                        </div>

                        {/* Simple Category Selector */}
                        <div className="relative w-full sm:w-48">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm cursor-pointer"
                            >
                                <option value="all">All Categories</option>
                                {categories.filter(c => !c.parent_id).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        <button
                            onClick={() => handleOpenModal()}
                            className="w-full sm:w-auto bg-red-600 hover:bg-black text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-black shadow-lg shadow-red-100 transition-all hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest"
                        >
                            <Plus size={18} strokeWidth={3} /> Add Product
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-8">

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100 text-sm">
                            <tr>
                                <th className="p-4 font-semibold w-16">Image</th>
                                <th className="p-4 font-semibold">Product Name</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        {p.image_url ? (
                                            <img src={getImageUrl(p.image_url)} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{p.name}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]" title={p.description}>{p.description}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {getCategoryName(p.category_id)}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-gray-900">{Number(p.price).toFixed(2)} DH</td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => toggleAvailability(p)}
                                            className="group flex items-center gap-2 outline-none"
                                        >
                                            <div className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${p.is_available ? 'bg-green-500' : 'bg-gray-200'}`}>
                                                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 shadow-sm ${p.is_available ? 'translate-x-4' : ''}`} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${p.is_available ? 'text-green-600' : 'text-gray-400'}`}>
                                                {p.is_available ? 'Available' : 'Sold Out'}
                                            </span>
                                        </button>
                                    </td>
                                    <td className="p-4 flex items-center justify-end gap-2">
                                        <button onClick={() => handleOpenModal(p)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-500 italic">
                                        No products found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-100 transform transition-all animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/80">
                            <div>
                                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                                        {editingProduct ? <Pencil size={16} /> : <Plus size={18} />}
                                    </div>
                                    {editingProduct ? 'Update Product' : 'Create New Product'}
                                </h3>
                            </div>
                            <button type="button" onClick={handleCloseModal} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                            <div className="p-6 overflow-y-auto">
                                <div className="flex flex-col gap-5">
                                    {/* Top Section: Image and Basic Info */}
                                    <div className="flex gap-6 items-start">
                                        <div className="w-32 shrink-0">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Visual</label>
                                            <div className="relative aspect-square w-full rounded-xl bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden group hover:border-red-400 transition-colors shadow-inner">
                                                {selectedFile || formData.image_url ? (
                                                    <img
                                                        src={selectedFile ? URL.createObjectURL(selectedFile) : getImageUrl(formData.image_url)}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400">
                                                        <ImageIcon size={24} />
                                                        <span className="text-[9px] font-bold mt-1">Upload</span>
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

                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                                    <Tag size={12} className="text-red-500" /> Item Title
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-gray-900 bg-white shadow-sm text-sm"
                                                    placeholder="e.g. Classic Pizza Margherita"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                                        <Info size={12} className="text-red-500" /> Category
                                                    </label>
                                                    <select
                                                        required
                                                        value={formData.category_id}
                                                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 outline-none bg-white font-bold text-gray-900 shadow-sm cursor-pointer text-sm"
                                                    >
                                                        <option value="" disabled>Select</option>
                                                        {categories.filter(c => !c.parent_id).map(parent => (
                                                            <optgroup key={parent.id} label={parent.name}>
                                                                <option value={parent.id}>{parent.name} (Main)</option>
                                                                {categories.filter(sub => sub.parent_id === parent.id).map(sub => (
                                                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                                ))}
                                                            </optgroup>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                                        <DollarSign size={12} className="text-red-500" /> Price
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            required
                                                            type="number"
                                                            step="0.01"
                                                            value={formData.price}
                                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                            className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-gray-900 bg-white shadow-sm text-sm"
                                                            placeholder="0.00"
                                                        />
                                                        <span className="absolute right-3 top-2.5 text-[10px] font-black text-gray-400 uppercase">DH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                            <AlignLeft size={12} className="text-red-500" /> Menu Description
                                        </label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none text-gray-900 text-sm font-bold bg-white shadow-sm"
                                            rows="3"
                                            placeholder="What are the ingredients or flavor profile?"
                                        ></textarea>
                                    </div>

                                    {/* Variants Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <DollarSign size={12} className="text-red-500" /> Size / Format Options
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addVariant}
                                                className="text-[10px] font-bold text-red-600 hover:text-black flex items-center gap-1 uppercase tracking-widest"
                                            >
                                                <Plus size={12} /> Add Option
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {formData.variants.map((variant, idx) => (
                                                <div key={idx} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
                                                    <input
                                                        required
                                                        type="text"
                                                        value={variant.name}
                                                        onChange={e => updateVariant(idx, 'name', e.target.value)}
                                                        placeholder="Option Name (e.g. Large)"
                                                        className="flex-1 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                                    />
                                                    <div className="w-32 relative">
                                                        <input
                                                            required
                                                            type="number"
                                                            step="0.01"
                                                            value={variant.price}
                                                            onChange={e => updateVariant(idx, 'price', e.target.value)}
                                                            placeholder="Price"
                                                            className="w-full border border-gray-100 rounded-xl pl-4 pr-10 py-2 text-sm font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                                        />
                                                        <span className="absolute right-3 top-2 text-[10px] font-black text-gray-300 uppercase">DH</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariant(idx)}
                                                        className="p-2 text-gray-300 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.variants.length === 0 && (
                                                <div className="text-[10px] text-gray-400 font-bold italic py-2">
                                                    No variants added. Base price will be used.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ingredients Section */}
                                    <div className="space-y-3 pt-2 border-t border-gray-100/50">
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <AlignLeft size={12} className="text-red-500" /> Ingrédients Personnalisables (Retirables)
                                            </label>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {formData.removable_ingredients.map(ing => (
                                                <span key={ing} className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-[11px] font-black border border-emerald-100">
                                                    {ing}
                                                    <button type="button" onClick={() => removeIngredient(ing)} className="hover:text-red-500 transition-colors">
                                                        <X size={12} strokeWidth={3} />
                                                    </button>
                                                </span>
                                            ))}
                                            {formData.removable_ingredients.length === 0 && (
                                                <p className="text-[10px] text-gray-400 font-bold italic py-1">Aucun ingrédient retirable configuré.</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <input 
                                                type="text"
                                                id="new-ingredient-input"
                                                placeholder="Ajouter un ingrédient (ex: Oignons)"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addIngredient(e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="flex-1 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const input = document.getElementById('new-ingredient-input');
                                                    addIngredient(input.value);
                                                    input.value = '';
                                                }}
                                                className="bg-emerald-600 hover:bg-black text-white px-4 py-2 rounded-xl font-bold text-[10px] uppercase transition-all"
                                            >
                                                Ajouter
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-gray-400 font-bold italic tracking-tight">Appuyez sur Entrée pour ajouter rapidement.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-900 px-4 py-2 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-red-600 hover:bg-black text-white font-black rounded-xl transition-all shadow-lg shadow-red-100 hover:shadow-black/10 hover:-translate-y-0.5 active:translate-y-0 text-[10px] tracking-widest uppercase"
                                >
                                    {editingProduct ? 'Save Updates' : 'Publish Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
