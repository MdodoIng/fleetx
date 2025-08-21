'use client';
import React, { useState } from 'react';
import {
  Search,
  Phone,
  MapPin,
  Clock,
  Package,
  User,
  CheckCircle,
  AlertCircle,
  Truck,
  Navigation,
  Grid,
  List,
} from 'lucide-react';

// Mock data for demonstration
const mockOrders = [
  {
    id: 'B-6MSEC',
    customerName: 'Tom Thomas',
    address: 'Dasman, Block 1',
    status: 'Active',
    statusColor: 'bg-yellow-500',
    estimatedTime: '5-20 Mins',
    phone: '34566342',
    currentLocation: 'Arab-Resto Cafe',
    currentAddress: 'Dasman, Block 1, St 17',
  },
  {
    id: 'B-6MSEC',
    customerName: 'Tom Thomas',
    address: 'Dasman, Block 1',
    status: 'Confirmed',
    statusColor: 'bg-blue-500',
    estimatedTime: '5-20 Mins',
    phone: '34566342',
    currentLocation: 'Processing',
  },
  {
    id: 'B-6MSEC',
    customerName: 'Tom Thomas',
    address: 'Dasman, Block 1',
    status: 'Urgent',
    statusColor: 'bg-red-500',
    estimatedTime: '5-20 Mins',
    phone: '34566342',
    currentLocation: 'Delayed',
  },
  {
    id: 'B-6MSEC',
    customerName: 'Tom Thomas',
    address: 'Dasman, Block 1',
    status: 'Active',
    statusColor: 'bg-yellow-500',
    estimatedTime: '5-20 Mins',
    phone: '34566342',
    currentLocation: 'En Route',
  },
  {
    id: 'B-6MSEC',
    customerName: 'Tom Thomas',
    address: 'Dasman, Block 1',
    status: 'Confirmed',
    statusColor: 'bg-blue-500',
    estimatedTime: '5-20 Mins',
    phone: '34566342',
    currentLocation: 'Preparing',
  },
  {
    id: 'B-6MSEC',
    customerName: 'Tom Thomas',
    address: 'Dasman, Block 1',
    status: 'Urgent',
    statusColor: 'bg-red-500',
    estimatedTime: '5-20 Mins',
    phone: '34566342',
    currentLocation: 'Critical',
  },
];

const orderStatuses = [
  {
    id: 'confirmed',
    label: 'Order Confirmed',
    icon: CheckCircle,
    color: 'text-green-600',
    active: true,
  },
  {
    id: 'assigned',
    label: 'Buddy Assigned',
    icon: User,
    color: 'text-blue-600',
    active: true,
  },
  {
    id: 'pickup-ready',
    label: 'Ready for Pickup',
    icon: Package,
    color: 'text-orange-500',
    active: false,
  },
  {
    id: 'pickup-arrived',
    label: 'Arrived at Pickup Location',
    icon: MapPin,
    color: 'text-purple-500',
    active: false,
  },
  {
    id: 'pickup-up',
    label: 'Order Picked Up',
    icon: Truck,
    color: 'text-indigo-500',
    active: false,
  },
  {
    id: 'customer',
    label: 'Reaching Customer Location',
    icon: Navigation,
    color: 'text-yellow-600',
    active: false,
  },
  {
    id: 'delivered',
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-green-600',
    active: false,
  },
];

export default function OrderTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [selectedOrder, setSelectedOrder] = useState(mockOrders[0]);

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 flex-col items-center">
      {/* Left Panel - Orders List */}

      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center justify-between ">
          <h2 className="text-xl font-semibold text-gray-900">Active Orders</h2>
       
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-center gap-1.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Order No, Customer, Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className=" px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Orders</option>
            <option>Active</option>
            <option>Confirmed</option>
            <option>Urgent</option>
          </select>
          <div className="flex gap-2 border bg-white rounded-md">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Grid className="w-5 h-5 text-gray-600" />
            </button>
            <span className='h-auto bg-gray-200 w-0.5 ' />
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <List className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 w-full gap-4">
        <div className="w-full bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}

          {/* Orders Header */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Orders</h3>
            <p className="text-xs text-gray-500 mt-1">
              Find a live or an active orders
            </p>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto">
            {filteredOrders.map((order, index) => (
              <div
                key={index}
                onClick={() => setSelectedOrder(order)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedOrder.id === order.id
                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {order.id}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-500">{order.address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{order.estimatedTime}</span>
                  </div>
                  <span>#{order.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Live Tracking Map */}
        <div className="flex-1 flex flex-col">
          {/* Map Header */}
          <div className="p-6 bg-white border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Live Tracking
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Live location updates right here
            </p>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative bg-gray-100">
            {/* Mock Map */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Map placeholder with some mock elements */}
              <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
              <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-green-500 rounded-full"></div>

              {/* Mock location info */}
              <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-full mb-2">
                <div className="bg-white rounded-lg shadow-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Tom Thomas</p>
                      <p className="text-xs text-gray-600">
                        Dasman, Block 1, St 17
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver location */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2">
                <div className="bg-white rounded-lg shadow-lg p-3 border">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Ahmad Al-Rashid</p>
                      <p className="text-xs text-gray-600">Driver</p>
                    </div>
                  </div>
                  <button className="mt-2 flex items-center gap-1 text-xs text-green-600 hover:text-green-700">
                    <Phone className="w-3 h-3" />
                    Call Driver
                  </button>
                </div>
              </div>

              {/* Mock street layout */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <path
                  d="M0,150 Q200,100 400,150 T800,150"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M150,0 Q200,200 150,400 T150,600"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M300,50 Q350,250 300,450"
                  stroke="#9CA3AF"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Panel - Order Details */}
        <div className="w-full bg-white border-l border-gray-200 flex flex-col">
          {/* Order Details Header */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Order Details
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete overview of Your Order Process
            </p>
          </div>

          {/* Customer Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {selectedOrder.customerName}
                </h4>
                <p className="text-sm text-gray-600">{selectedOrder.address}</p>
                <p className="text-sm text-gray-500 mt-1">Customer Method</p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-lg">
                  {selectedOrder.id}
                </span>
                <p className="text-sm text-gray-600">K Net (Card)</p>
                <p className="text-sm text-gray-600 mt-1">1.5 KD</p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-1">Delivery Fee</p>
              <p className="font-medium">#{selectedOrder.phone}</p>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="space-y-4">
                {orderStatuses.map((status, index) => {
                  const Icon = status.icon;
                  return (
                    <div key={status.id} className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          status.active
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 bg-white text-gray-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            status.active ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {status.label}
                        </p>
                        {status.active && (
                          <p className="text-xs text-green-600 mt-1">
                            Completed
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
