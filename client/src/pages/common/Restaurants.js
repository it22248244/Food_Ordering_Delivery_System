import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaClock, FaMotorcycle, FaMapMarkerAlt } from 'react-icons/fa';
import apiService from '../../utils/api';
import useApi from '../../hooks/useApi';
import './Restaurants.css';

// Mock data for development
const mockRestaurants = [
  {
    _id: '1',
    name: 'Spice Garden',
    cuisine: 'Indian',
    description: 'Authentic Indian cuisine with a modern twist. Specializing in tandoori dishes and rich curries.',
    rating: 4.5,
    priceRange: '$$',
    deliveryTime: '30-45 min',
    distance: '1.2',
    isOpen: true,
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    address: {
      street: '123 Curry Lane',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00100',
      country: 'Sri Lanka'
    }
  },
  {
    _id: '2',
    name: 'Pasta Paradise',
    cuisine: 'Italian',
    description: 'Handmade pasta and authentic Italian recipes passed down through generations.',
    rating: 4.8,
    priceRange: '$$$',
    deliveryTime: '25-40 min',
    distance: '0.8',
    isOpen: true,
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    address: {
      street: '456 Pasta Street',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00200',
      country: 'Sri Lanka'
    }
  },
  {
    _id: '3',
    name: 'Sushi Master',
    cuisine: 'Japanese',
    description: 'Fresh sushi and traditional Japanese dishes prepared by master chefs.',
    rating: 4.7,
    priceRange: '$$$',
    deliveryTime: '35-50 min',
    distance: '1.5',
    isOpen: true,
    images: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    address: {
      street: '789 Sushi Avenue',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00300',
      country: 'Sri Lanka'
    }
  },
  {
    _id: '4',
    name: 'Burger Haven',
    cuisine: 'American',
    description: 'Gourmet burgers and classic American comfort food.',
    rating: 4.3,
    priceRange: '$$',
    deliveryTime: '20-35 min',
    distance: '0.5',
    isOpen: true,
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    address: {
      street: '321 Burger Road',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00400',
      country: 'Sri Lanka'
    }
  },
  {
    _id: '5',
    name: 'Dragon Palace',
    cuisine: 'Chinese',
    description: 'Authentic Chinese cuisine with a focus on Sichuan and Cantonese dishes.',
    rating: 4.6,
    priceRange: '$$',
    deliveryTime: '30-45 min',
    distance: '1.0',
    isOpen: true,
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    address: {
      street: '654 Dragon Street',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00500',
      country: 'Sri Lanka'
    }
  },
  {
    _id: '6',
    name: 'Mediterranean Delight',
    cuisine: 'Mediterranean',
    description: 'Fresh Mediterranean cuisine with a focus on healthy, flavorful dishes.',
    rating: 4.4,
    priceRange: '$$$',
    deliveryTime: '25-40 min',
    distance: '1.3',
    isOpen: true,
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    address: {
      street: '987 Olive Lane',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00600',
      country: 'Sri Lanka'
    }
  },
  {
    _id: '7',
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    description: 'Authentic Mexican street food and traditional dishes.',
    rating: 4.2,
    priceRange: '$$',
    deliveryTime: '20-35 min',
    distance: '0.7',
    isOpen: true,
    images: [
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    address: {
      street: '159 Taco Street',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00700',
      country: 'Sri Lanka'
    }
  },
  {
    _id: '8',
    name: 'Green Leaf',
    cuisine: 'Vegetarian',
    description: 'Healthy vegetarian and vegan options with a focus on organic ingredients.',
    rating: 4.9,
    priceRange: '$$',
    deliveryTime: '25-40 min',
    distance: '1.1',
    isOpen: true,
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    address: {
      street: '753 Green Avenue',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00800',
      country: 'Sri Lanka'
    }
  }
];

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [cuisines, setCuisines] = useState([]);
  const { loading, error } = useApi();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search');
        const cuisine = searchParams.get('cuisine');

        if (search) setSearchQuery(search);
        if (cuisine) setSelectedCuisine(cuisine);

        // For development, directly use mock data
        setRestaurants(mockRestaurants);
        setFilteredRestaurants(mockRestaurants);
        setCuisines([...new Set(mockRestaurants.map(r => r.cuisine))]);

        // Uncomment this when API is ready
        /*
        try {
          const restaurantsData = await apiService.restaurants.getAll();
          setRestaurants(restaurantsData.data.restaurants || []);
          setFilteredRestaurants(restaurantsData.data.restaurants || []);
          setCuisines([...new Set(restaurantsData.data.restaurants.map(r => r.cuisine))]);
        } catch (apiError) {
          console.error('Error fetching from API:', apiError);
          setRestaurants(mockRestaurants);
          setFilteredRestaurants(mockRestaurants);
          setCuisines([...new Set(mockRestaurants.map(r => r.cuisine))]);
        }
        */
      } catch (err) {
        console.error('Error in fetchData:', err);
        setRestaurants(mockRestaurants);
        setFilteredRestaurants(mockRestaurants);
        setCuisines([...new Set(mockRestaurants.map(r => r.cuisine))]);
      }
    };

    fetchData();
  }, [location]);

  // Filter restaurants based on search and filters
  useEffect(() => {
    let filtered = [...restaurants];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply cuisine filter
    if (selectedCuisine) {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisine === selectedCuisine
      );
    }

    // Apply price filter
    if (selectedPrice) {
      filtered = filtered.filter(restaurant =>
        restaurant.priceRange === selectedPrice
      );
    }

    // Apply rating filter
    if (selectedRating) {
      filtered = filtered.filter(restaurant =>
        Math.floor(restaurant.rating) >= parseInt(selectedRating)
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCuisine, selectedPrice, selectedRating, restaurants]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with search query
    const params = new URLSearchParams(location.search);
    params.set('search', searchQuery);
    window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="restaurants-page">
      {/* Header Section */}
      <div className="restaurants-header">
        <h1>Restaurants</h1>
        <p>Discover and order from the best restaurants in your area</p>
      </div>

      {/* Search and Filters Section */}
      <div className="search-filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="cuisine-filter">Cuisine</label>
            <select
              id="cuisine-filter"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="filter-select"
            >
              <option value="">All Cuisines</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="price-filter">Price Range</label>
            <select
              id="price-filter"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="filter-select"
            >
              <option value="">All Prices</option>
              <option value="$">$</option>
              <option value="$$">$$</option>
              <option value="$$$">$$$</option>
              <option value="$$$$">$$$$</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="rating-filter">Minimum Rating</label>
            <select
              id="rating-filter"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="filter-select"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="restaurants-grid">
        {loading ? (
          <div className="loading-spinner">Loading restaurants...</div>
        ) : error ? (
          <div className="error-message">
            Could not load restaurants. Please try again later.
          </div>
        ) : filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/restaurants/${restaurant._id}`}
              className="restaurant-card"
            >
              <div className="restaurant-image">
                <img
                  src={restaurant.images?.[0] || '/images/restaurant-placeholder.jpg'}
                  alt={restaurant.name}
                />
                {restaurant.isOpen ? (
                  <span className="status-badge open">Open</span>
                ) : (
                  <span className="status-badge closed">Closed</span>
                )}
              </div>
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="cuisine">{restaurant.cuisine}</p>
                <div className="restaurant-meta">
                  <span className="rating">
                    <FaStar /> {restaurant.rating || '0.0'}
                  </span>
                  <span className="delivery-time">
                    <FaClock /> 30-45 min
                  </span>
                </div>
                <div className="restaurant-details">
                  <span className="price-range">{restaurant.priceRange || '$$'}</span>
                  <span className="distance">
                    <FaMapMarkerAlt /> {restaurant.distance || '1.2'} miles
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <p>No restaurants found matching your criteria.</p>
            <button
              className="clear-filters-button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine('');
                setSelectedPrice('');
                setSelectedRating('');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants; 