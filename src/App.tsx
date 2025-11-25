import React, { useState, useEffect } from 'react';
import { Search, Phone, ShoppingCart, X, Plus, Minus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { products } from './data';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type Toast = {
  message: string;
  visible: boolean;
};

const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80",
    title: "Summer Sale!",
    subtitle: "Up to 50% off on daily essentials"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80",
    title: "Daily Groceries",
    subtitle: "Fresh products delivered daily"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80",
    title: "Premium Chocolates",
    subtitle: "Indulge in luxury"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80",
    title: "Ice Cream Collection",
    subtitle: "Beat the heat with our frozen treats"
  }
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof products[0] | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [toast, setToast] = useState<Toast>({ message: '', visible: false });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ message: '', visible: false });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term && !recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev].slice(0, 5));
    }
    setShowRecentSearches(false);
  };

  const handleCall = () => {
    window.location.href = 'tel:+917093488939';
  };

  const addToCart = (product: typeof products[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    showToast('Item added to cart successfully!');
    setSelectedItem(null);
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    showToast('Item removed from cart');
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleBuyNow = () => {
    const message = cart
      .map(item => `${item.quantity}x ${item.name} - ₹${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');
    const total = `\nTotal: ₹${getTotalPrice().toFixed(2)}`;
    const whatsappMessage = encodeURIComponent(`My Order:\n${message}${total}`);
    const phoneNumber = '+917093488939'; // Added + before the number
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${whatsappMessage}`;
    window.location.href = whatsappUrl; // Changed from window.open to window.location.href
  };

  const handleItemClick = (item: typeof products[0]) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-[#FF385C] shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => {
            setSearchTerm('');
            setSelectedItem(null);
            setShowCart(false);
          }}>Homessy</h1>
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg pl-10 pr-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowRecentSearches(true);
                }}
                onFocus={() => setShowRecentSearches(true)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              {searchTerm && (
                <X
                  className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                  size={20}
                  onClick={() => {
                    setSearchTerm('');
                    setShowRecentSearches(false);
                  }}
                />
              )}
              {showRecentSearches && recentSearches.length > 0 && (
                <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg">
                  {recentSearches.map((term, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleSearch(term)}
                    >
                      <Search size={16} className="text-gray-400 mr-2" />
                      {term}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <ShoppingCart
              className="text-white cursor-pointer"
              size={24}
              onClick={() => setShowCart(!showCart)}
            />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#FF385C] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mt-16 pt-4">
        {/* Cart Overlay */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <X
                  className="cursor-pointer"
                  size={24}
                  onClick={() => setShowCart(false)}
                />
              </div>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center mb-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">₹{item.price}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 bg-gray-200 rounded-full"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="mx-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 bg-gray-200 rounded-full"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <div className="mt-6">
                    <div className="flex justify-between mb-4">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold">₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-[#FF385C] text-white py-3 rounded-lg hover:bg-[#E62E50] transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Item Detail Page */}
        {selectedItem && (
          <div className="container mx-auto px-4">
            <button
              onClick={() => setSelectedItem(null)}
              className="mb-4 flex items-center text-gray-600 hover:text-[#FF385C] transition-colors"
            >
              <ChevronLeft size={24} />
              <span className="ml-1">Home</span>
            </button>
            <div className="bg-white rounded-lg shadow-lg p-6 md:flex gap-8">
              <div className="md:w-1/2">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <h2 className="text-3xl font-bold mb-4">{selectedItem.name}</h2>
                <p className="text-2xl text-gray-700 mb-6">₹{selectedItem.price}</p>
                <button
                  onClick={() => addToCart(selectedItem)}
                  className="w-full bg-[#FF385C] text-white py-3 rounded-lg hover:bg-[#E62E50] transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section - Only show when not searching */}
        {!searchTerm && !selectedItem && (
          <section className="mb-12">
            <div className="container mx-auto px-4">
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <div className="relative">
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className={`absolute w-full transition-opacity duration-500 ${
                        index === currentBanner ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ pointerEvents: index === currentBanner ? 'auto' : 'none' }}
                    >
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-[400px] object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h2 className="text-5xl font-bold mb-4">{banner.title}</h2>
                          <p className="text-2xl">{banner.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                  onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                  onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentBanner ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentBanner(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Product Sections - Only show when not viewing item details */}
        {!selectedItem && (
          <>
            {/* Daily Essentials Section */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6">Daily Essentials</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {filteredProducts
                    .filter(product => product.category === 'daily')
                    .map(product => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleItemClick(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-gray-600">₹{product.price}</p>
                        <button
                          className="mt-2 w-full bg-[#FF385C] text-white py-2 rounded-lg hover:bg-[#E62E50] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </section>

            {/* Home Items Section */}
            <section className="py-12 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6">Home Essentials</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {filteredProducts
                    .filter(product => product.category === 'home')
                    .map(product => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleItemClick(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-gray-600">₹{product.price}</p>
                        <button
                          className="mt-2 w-full bg-[#FF385C] text-white py-2 rounded-lg hover:bg-[#E62E50] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white text-gray-800 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#FF385C]">Home</a></li>
                <li><a href="#" className="hover:text-[#FF385C]">About us</a></li>
                <li><a href="#" className="hover:text-[#FF385C]">Careers</a></li>
                <li><a href="#" className="hover:text-[#FF385C]">Customer Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#FF385C]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#FF385C]">Terms of Use</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#FF385C]">Blog</a></li>
                <li><a href="#" className="hover:text-[#FF385C]">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Social Media</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-[#FF385C]">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-[#FF385C]">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-[#FF385C]">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-[#FF385C]">
                  <svg className="w-6 h-6" viewBox="0 0 192 192" fill="currentColor">
                    <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">© 2025 Homessy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Call Button */}
      <button
        onClick={handleCall}
        className="fixed bottom-6 right-6 bg-[#FF385C] text-white p-4 rounded-full shadow-lg hover:bg-[#E62E50] transition-colors"
      >
        <Phone size={24} />
      </button>
    </div>
  );
}

export default App;