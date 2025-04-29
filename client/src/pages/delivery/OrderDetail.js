import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

const DeliveryOrderDetail = () => {
  const { id } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    setLoading(false);
    setDelivery({
      _id: 'delivery-id',
      orderId: id,
      status: 'assigned',
      restaurantId: 'restaurant-id',
      restaurantName: 'Restaurant Name',
      restaurantAddress: '123 Main St, City, State',
      deliveryAddress: '456 Elm St, City, State',
      customerName: 'Customer Name',
      customerPhone: '123-456-7890',
      orderItems: [],
      assignedAt: new Date().toISOString(),
      pickedUpAt: null,
      deliveredAt: null,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
    });
  }, [id]);

  const updateDeliveryStatus = (status) => {
    console.log(`Updating delivery status to ${status}`);
    setDelivery((prevDelivery) => ({
      ...prevDelivery,
      status,
      ...(status === 'picked_up' ? { pickedUpAt: new Date().toISOString() } : {}),
      ...(status === 'delivered' ? { deliveredAt: new Date().toISOString() } : {}),
    }));
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading delivery details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order #{id.slice(-6)}</h1>
          <div>
            <span className="mr-2">Status:</span>
            <span
              className={`px-2 py-1 rounded ${
                delivery.status === 'assigned'
                  ? 'bg-yellow-100 text-yellow-800'
                  : delivery.status === 'picked_up'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {delivery.status.replace('_', ' ').charAt(0).toUpperCase() +
                delivery.status.replace('_', ' ').slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
              <div className="divide-y divide-gray-200">
                <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Restaurant:</h3>
                    <p className="text-gray-700">{delivery.restaurantName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Pickup Address:</h3>
                    <p className="text-gray-700">{delivery.restaurantAddress}</p>
                  </div>
                </div>

                <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Customer:</h3>
                    <p className="text-gray-700">{delivery.customerName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Delivery Address:</h3>
                    <p className="text-gray-700">{delivery.deliveryAddress}</p>
                  </div>
                </div>

                <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Customer Phone:</h3>
                    <p className="text-gray-700">{delivery.customerPhone}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Estimated Delivery Time:</h3>
                    <p className="text-gray-700">
                      {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {delivery.pickedUpAt && (
                  <div className="py-3">
                    <h3 className="font-medium">Picked Up At:</h3>
                    <p className="text-gray-700">{new Date(delivery.pickedUpAt).toLocaleString()}</p>
                  </div>
                )}

                {delivery.deliveredAt && (
                  <div className="py-3">
                    <h3 className="font-medium">Delivered At:</h3>
                    <p className="text-gray-700">{new Date(delivery.deliveredAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              {delivery.orderItems.length === 0 ? (
                <p className="text-gray-500">No items in this order</p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {delivery.orderItems.map((item, index) => (
                    <div key={index} className="py-3 flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ${item.price}
                        </p>
                      </div>
                      <p className="font-medium">${item.quantity * item.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Actions</h2>

              {delivery.status === 'assigned' && (
                <button
                  onClick={() => updateDeliveryStatus('picked_up')}
                  className="w-full py-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Mark as Picked Up
                </button>
              )}

              {delivery.status === 'picked_up' && (
                <button
                  onClick={() => updateDeliveryStatus('delivered')}
                  className="w-full py-2 mb-4 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark as Delivered
                </button>
              )}

              <a
                href={`tel:${delivery.customerPhone}`}
                className="block w-full py-2 mb-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex justify-center items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call Customer
              </a>
            </div>

            <div className="mt-6">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(delivery.deliveryAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderDetail;
