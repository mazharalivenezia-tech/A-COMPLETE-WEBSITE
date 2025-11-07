
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, totalItems } = useCart();

    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 5;
    const taxes = subtotal * 0.08; // Example 8% tax
    const total = subtotal + shipping + taxes;

    if (totalItems === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/shop/men" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-blue-600 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-8 text-center">Shopping Cart</h1>
                <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
                    <section aria-labelledby="cart-heading" className="lg:col-span-8 bg-white rounded-lg shadow-sm">
                        <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
                        <ul role="list" className="divide-y divide-gray-200">
                            {cartItems.map(item => (
                                <li key={item.id} className="flex py-6 px-4 sm:px-6">
                                    <div className="flex-shrink-0">
                                        <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 rounded-md object-cover object-center sm:w-32 sm:h-32" />
                                    </div>
                                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm">
                                                        <Link to={`/product/${item.product.id}`} className="font-medium text-gray-700 hover:text-gray-800">{item.product.name}</Link>
                                                    </h3>
                                                </div>
                                                <div className="mt-1 flex text-sm">
                                                    <p className="text-gray-500">{item.selectedColor}</p>
                                                    <p className="ml-4 pl-4 border-l border-gray-200 text-gray-500">{item.selectedSize}</p>
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-900">${item.product.price.toFixed(2)}</p>
                                            </div>
                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity, {item.product.name}</label>
                                                <input
                                                    id={`quantity-${item.id}`}
                                                    name={`quantity-${item.id}`}
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={e => updateQuantity(item.id, parseInt(e.target.value, 10))}
                                                    className="w-20 text-center border-gray-300 rounded-md shadow-sm text-sm p-2 focus:ring-primary focus:border-primary"
                                                />
                                                <div className="absolute top-0 right-0">
                                                    <button type="button" onClick={() => removeFromCart(item.id)} className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500">
                                                        <span className="sr-only">Remove</span>
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                    
                    <section aria-labelledby="summary-heading" className="mt-16 bg-white rounded-lg shadow-sm lg:col-span-4 lg:mt-0 lg:p-6 p-4">
                        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="flex items-center text-sm text-gray-600">
                                    <span>Shipping</span>
                                </dt>
                                <dd className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Taxes (est.)</dt>
                                <dd className="text-sm font-medium text-gray-900">${taxes.toFixed(2)}</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="text-base font-medium text-gray-900">Order total</dt>
                                <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
                            </div>
                        </dl>
                        <div className="mt-6">
                            <button className="w-full bg-primary border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Proceed to Checkout
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
