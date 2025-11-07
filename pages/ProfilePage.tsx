
import React, from 'react';
import { useState } from 'react';

// --- Mock Data ---
const mockUser = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const mockOrders = [
  { id: 'FAS12345', date: '2023-10-26', status: 'Delivered', total: 144.98, items: [{ name: 'Faskicks Pro Runner', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' }, { name: 'Faskicks Performance Tee', image: 'https://images.unsplash.com/photo-1593424845942-1a270b2a79a1?w=100' }] },
  { id: 'FAS12301', date: '2023-09-15', status: 'Shipped', total: 85.00, items: [{ name: 'Faskicks Classic Court', image: 'https://images.unsplash.com/photo-1600269452121-4f7e18b48b96?w=100' }] },
  { id: 'FAS12256', date: '2023-08-02', status: 'Delivered', total: 204.98, items: [{ name: 'Faskicks Studio Leggings', image: 'https://images.unsplash.com/photo-1584735935639-5292a43361e2?w=100' }, { name: 'Faskicks Cozy Hoodie', image: 'https://images.unsplash.com/photo-1578761719693-137a68a735f3?w=100' }] },
];

const mockAddresses = [
  { id: 1, type: 'Shipping', name: 'Alex Johnson', street: '123 Market St', city: 'San Francisco', state: 'CA', zip: '94103', isDefault: true },
  { id: 2, type: 'Billing', name: 'Alex Johnson', street: '456 Tech Ave', city: 'Palo Alto', state: 'CA', zip: '94301', isDefault: false },
];

// --- Icon Components ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const OrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const AddressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

// --- Sub-components for each view ---

const ProfileDetails: React.FC = () => (
    <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
        <div className="flex items-center space-x-6">
            <img className="h-24 w-24 rounded-full object-cover" src={mockUser.avatar} alt="User avatar" />
            <div>
                <h3 className="text-xl font-semibold">{mockUser.name}</h3>
                <p className="text-gray-500">{mockUser.email}</p>
            </div>
        </div>
        <div className="mt-8 border-t pt-6">
            <button className="text-sm font-medium text-primary hover:text-blue-700">Edit Profile</button>
        </div>
    </div>
);

const OrderHistory: React.FC = () => {
    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Processing': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>
            <div className="space-y-6">
                {mockOrders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500">Placed on {order.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">${order.total.toFixed(2)}</p>
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClasses(order.status)}`}>{order.status}</span>
                            </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                           <div className="flex justify-between items-center">
                                <div className="flex -space-x-4">
                                    {order.items.map((item, index) => (
                                        <img key={index} src={item.image} alt={item.name} className="h-12 w-12 rounded-full border-2 border-white object-cover" title={item.name} />
                                    ))}
                                </div>
                                <div className="flex items-center space-x-4">
                                    {order.status === 'Shipped' && (
                                        <button
                                            onClick={() => alert('Tracking details coming soon!')}
                                            className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors"
                                        >
                                            Track Order
                                        </button>
                                    )}
                                    <button className="text-sm font-medium text-primary hover:text-blue-700">View Details</button>
                                </div>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const AddressBook: React.FC = () => (
     <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-gray-800">Addresses</h2>
             <button className="text-sm font-medium bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600">Add New Address</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockAddresses.map(addr => (
                <div key={addr.id} className="border rounded-lg p-4 relative">
                    {addr.isDefault && <span className="absolute top-2 right-2 text-xs font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded-full">Default</span>}
                    <h3 className="font-semibold text-gray-800">{addr.type} Address</h3>
                    <address className="mt-2 text-sm text-gray-600 not-italic">
                        {addr.name}<br />
                        {addr.street}<br />
                        {addr.city}, {addr.state} {addr.zip}
                    </address>
                    <div className="mt-4 pt-4 border-t space-x-4 text-sm">
                        <button className="font-medium text-primary hover:text-blue-700">Edit</button>
                        <button className="font-medium text-red-600 hover:text-red-800">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const ProfilePage: React.FC = () => {
    const [activeView, setActiveView] = useState('profile');
    
    const navItems = [
        { id: 'profile', label: 'My Profile', icon: <UserIcon /> },
        { id: 'orders', label: 'Order History', icon: <OrderIcon /> },
        { id: 'addresses', label: 'Addresses', icon: <AddressIcon /> },
    ];
    
    const activeClass = "bg-primary/10 text-primary border-l-4 border-primary";
    const inactiveClass = "text-gray-600 hover:bg-gray-100 hover:text-gray-800";

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8">My Account</h1>
                <div className="md:grid md:grid-cols-12 md:gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="md:col-span-3 lg:col-span-2 mb-8 md:mb-0">
                        <nav className="space-y-2">
                           {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveView(item.id)}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-r-lg transition-colors ${activeView === item.id ? activeClass : inactiveClass}`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                           ))}
                            <button className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-r-lg transition-colors ${inactiveClass}`}>
                                <LogoutIcon />
                                Logout
                            </button>
                        </nav>
                    </aside>
                    
                    {/* Content Area */}
                    <main className="md:col-span-9 lg:col-span-10">
                        {activeView === 'profile' && <ProfileDetails />}
                        {activeView === 'orders' && <OrderHistory />}
                        {activeView === 'addresses' && <AddressBook />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;