import { useState, useMemo } from 'react';
import { ShoppingCart, Menu, X, Heart, Star, Search, SlidersHorizontal } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const products: Product[] = [
    {
      id: 1,
      name: 'Áo Sơ Mi Công Sở',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      category: 'Áo Nam',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Áo Thun Basic',
      price: 250000,
      image: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      category: 'Áo Nam',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Quần Jeans Slim Fit',
      price: 550000,
      image: 'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      category: 'Quần Nam',
      rating: 4.3
    },
    {
      id: 4,
      name: 'Áo Hoodie Premium',
      price: 650000,
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      category: 'Áo Nam',
      rating: 4.7
    },
    {
      id: 5,
      name: 'Áo Khoác Denim',
      price: 750000,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      category: 'Áo Khoác',
      rating: 4.6
    },
    {
      id: 6,
      name: 'Quần Kaki Tây',
      price: 480000,
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      category: 'Quần Nam',
      rating: 4.4
    }
  ];

  const categories = ['Tất cả', 'Áo Nam', 'Quần Nam', 'Áo Khoác'];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="font-bold text-xl text-gray-900">Fashion Store</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900">Trang Chủ</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Nam</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Nữ</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Phụ Kiện</a>
            </nav>

            {/* Cart Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-gray-900"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2">
              <a href="#" className="block text-gray-700 hover:text-gray-900 py-2">Trang Chủ</a>
              <a href="#" className="block text-gray-700 hover:text-gray-900 py-2">Nam</a>
              <a href="#" className="block text-gray-700 hover:text-gray-900 py-2">Nữ</a>
              <a href="#" className="block text-gray-700 hover:text-gray-900 py-2">Phụ Kiện</a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl mb-4">Bộ Sưu Tập Mùa Hè 2026</h2>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Khám phá phong cách thời trang mới nhất với giá ưu đãi
            </p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Mua Ngay
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden w-full flex items-center justify-center gap-2 mb-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Bộ lọc</span>
          </button>

          {/* Filters */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">Danh mục</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">Giá tối thiểu</label>
                <select
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={0}>0₫</option>
                  <option value={200000}>200,000₫</option>
                  <option value={400000}>400,000₫</option>
                  <option value={600000}>600,000₫</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Giá tối đa</label>
                <select
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={400000}>400,000₫</option>
                  <option value={600000}>600,000₫</option>
                  <option value={800000}>800,000₫</option>
                  <option value={1000000}>1,000,000₫</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">Sắp xếp theo</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="name">Tên A-Z</option>
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  Tìm kiếm: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-purple-900">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'Tất cả' && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('Tất cả')} className="hover:text-purple-900">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {(priceRange[0] !== 0 || priceRange[1] !== 1000000) && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {priceRange[0].toLocaleString('vi-VN')}₫ - {priceRange[1].toLocaleString('vi-VN')}₫
                  <button onClick={() => setPriceRange([0, 1000000])} className="hover:text-purple-900">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl text-gray-900">Sản Phẩm Nổi Bật</h2>
          <span className="text-gray-600">
            {filteredAndSortedProducts.length} sản phẩm
          </span>
        </div>

        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tất cả');
                setPriceRange([0, 1000000]);
                setSortBy('default');
              }}
              className="mt-4 text-purple-600 hover:text-purple-700"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                <h3 className="text-lg mb-2 text-gray-900">{product.name}</h3>

                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl text-gray-900">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </section>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl text-gray-900">Giỏ Hàng</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Giỏ hàng trống</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-600 mb-2">
                          {item.price.toLocaleString('vi-VN')}₫
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500 hover:text-red-700 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Tổng cộng:</span>
                  <span className="text-gray-900">{totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
                  Thanh Toán
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg mb-4">Về Fashion Store</h3>
              <p className="text-gray-400">
                Cửa hàng thời trang uy tín, chất lượng cao với giá cả hợp lý.
              </p>
            </div>
            <div>
              <h3 className="text-lg mb-4">Liên Hệ</h3>
              <p className="text-gray-400">Email: contact@fashionstore.com</p>
              <p className="text-gray-400">Điện thoại: 0123 456 789</p>
            </div>
            <div>
              <h3 className="text-lg mb-4">Theo Dõi Chúng Tôi</h3>
              <p className="text-gray-400">Facebook | Instagram | Twitter</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Fashion Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}