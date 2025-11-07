import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import { menFashionCategories, womenFashionCategories, kidsFashionCategories, sportsCategories, workwearsCategories, safetywearsCategories } from '../constants';

// --- Type definitions for Google APIs ---
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

// --- Icon Components ---
const CloudUploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9m0 0l-3-3m3 3l3-3" />
    </svg>
);


const TagInput: React.FC<{
  label: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
}> = ({ label, tags, setTags, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex flex-wrap items-center gap-2 p-2 border rounded-md border-gray-300 shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
        {tags.map((tag, index) => (
          <span key={index} className="flex items-center gap-1 bg-primary/10 text-primary text-sm font-semibold px-2 py-1 rounded">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-primary hover:text-red-600 font-bold"
              aria-label={`Remove ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="flex-grow border-none focus:ring-0 p-1 text-sm"
        />
      </div>
    </div>
  );
};


const DashboardPage: React.FC = () => {
  const { products, addProduct, deleteProduct } = useProducts();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- Google Drive State ---
  const [isGapiReady, setIsGapiReady] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [isDriveSaving, setIsDriveSaving] = useState(false);
  const [driveFileId, setDriveFileId] = useState<string | null>(null);
  const [driveMessage, setDriveMessage] = useState('');

  const DRIVE_API_KEY = process.env.API_KEY; 
  const DRIVE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.file';
  const DRIVE_DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  const FILE_NAME = 'faskicks_products.json';


  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('dashboard_auth') === 'true';
    if (isLoggedIn) {
      setIsAuthenticated(true);
    }
  }, []);

  // Effect to load and initialize Google's scripts
  useEffect(() => {
    if(!isAuthenticated) return;

    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = () => {
        window.gapi.load('client', () => {
            window.gapi.client.init({
                apiKey: DRIVE_API_KEY,
                discoveryDocs: [DRIVE_DISCOVERY_DOC],
            }).then(() => {
                setIsGapiReady(true);
            }).catch((e: any) => console.error("Error initializing GAPI client", e));
        });
    };
    document.body.appendChild(gapiScript);

    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.async = true;
    gisScript.defer = true;
    gisScript.onload = () => {
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: DRIVE_CLIENT_ID,
            scope: DRIVE_SCOPES,
            callback: '', // Callback is handled by the promise flow
        });
        setTokenClient(client);
    };
    document.body.appendChild(gisScript);

    return () => {
        document.body.removeChild(gapiScript);
        document.body.removeChild(gisScript);
    };
  }, [isAuthenticated]);
  
  const initialFormState: Omit<Product, 'id' | 'rating' | 'reviewCount'> = {
    name: '',
    price: 0,
    category: 'men',
    productType: 'Footwear',
    subCategory: '',
    fashionCategory: '',
    images: [],
    colors: [],
    sizes: [],
    description: '',
    details: [],
    isNew: true,
    isBestSeller: false,
  };

  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let newState = { ...formState };

    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        newState = { ...newState, [name]: checked };
    } else {
        newState = { ...newState, [name]: type === 'number' ? parseFloat(value) || 0 : value };
    }

    if (name === 'productType' && value !== 'Apparel') {
        newState.subCategory = '';
        newState.fashionCategory = '';
    }
    
    if (name === 'category') {
        newState.subCategory = '';
        newState.fashionCategory = '';
    }

    if (name === 'subCategory' && !['Fashion', 'Sports', 'Workwears', 'Safety Wears'].includes(value)) {
        newState.fashionCategory = '';
    }

    setFormState(newState);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const filesArray = Array.from(e.target.files);
          const filePromises = filesArray.map((file: File) => {
              return new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = error => reject(error);
              });
          });

          Promise.all(filePromises).then(base64Images => {
              setFormState(prev => ({
                  ...prev,
                  images: [...prev.images, ...base64Images]
              }));
          }).catch(error => {
              console.error("Error reading files:", error);
          });
      }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormState(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState.images.length === 0) {
        alert('Please upload at least one image.');
        return;
    }
    addProduct(formState);
    setFormState(initialFormState);
    alert('Product added successfully!');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Pakistan1947@') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dashboard_auth', 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

    const getAccessToken = async () => {
        return new Promise((resolve, reject) => {
            tokenClient.callback = (resp: any) => {
                if (resp.error) reject(resp);
                else resolve(resp);
            };
            if (window.gapi.client.getToken() === null) {
                tokenClient.requestAccessToken({ prompt: 'consent' });
            } else {
                tokenClient.requestAccessToken({ prompt: '' });
            }
        });
    };

    const findOrCreateFile = async () => {
        if (driveFileId) return driveFileId;
        try {
            const response = await window.gapi.client.drive.files.list({
                q: `name='${FILE_NAME}' and 'root' in parents and trashed=false`,
                fields: 'files(id, name)',
            });
            if (response.result.files && response.result.files.length > 0) {
                const foundFileId = response.result.files[0].id!;
                setDriveFileId(foundFileId);
                return foundFileId;
            } else {
                const createResponse = await window.gapi.client.drive.files.create({
                    resource: { name: FILE_NAME, mimeType: 'application/json' },
                    fields: 'id',
                });
                const newFileId = createResponse.result.id!;
                setDriveFileId(newFileId);
                return newFileId;
            }
        } catch (e) {
            console.error("Error finding or creating file", e);
            setDriveMessage('Error accessing Google Drive files.');
            throw e;
        }
    };
    
    const handleSaveToDrive = async () => {
        if (!isGapiReady || !tokenClient) {
            setDriveMessage('Google Drive connection is not ready.');
            return;
        }
        setIsDriveSaving(true);
        setDriveMessage('Authenticating with Google...');
        try {
            await getAccessToken();
            setDriveMessage('Authenticated. Locating file...');
            const fileId = await findOrCreateFile();
            setDriveMessage('Saving product data...');
            const productsJson = JSON.stringify(products, null, 2);
            
            const boundary = '-------314159265358979323846';
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";
            
            const metadata = { name: FILE_NAME, mimeType: 'application/json' };
            const multipartRequestBody =
                delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata) +
                delimiter + 'Content-Type: application/json\r\n\r\n' + productsJson +
                close_delim;
            
            await window.gapi.client.request({
                path: `/upload/drive/v3/files/${fileId}`,
                method: 'PATCH',
                params: { uploadType: 'multipart' },
                headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
                body: multipartRequestBody
            });
            setDriveMessage('Products saved successfully to Google Drive!');
        } catch (error: any) {
            console.error('Error saving to drive:', error);
            if (error.result?.error?.message) {
                 setDriveMessage(`Error: ${error.result.error.message}`);
            } else if (error.error === 'popup_closed_by_user') {
                setDriveMessage('Authentication cancelled.');
            } else {
                setDriveMessage('An unknown error occurred while saving.');
            }
        } finally {
            setIsDriveSaving(false);
            setTimeout(() => setDriveMessage(''), 5000);
        }
    };


  const apparelSubCategories = {
    men: ['Fashion', 'Sports', 'Workwears', 'Safety Wears'],
    women: ['Fashion', 'Sports', 'Workwears', 'Safety Wears'],
    kids: ['Fashion', 'Sports'],
  };

  const fashionCategoryOptions = {
      men: menFashionCategories,
      women: womenFashionCategories,
      kids: kidsFashionCategories,
  };

  const showSubCategory = formState.productType === 'Apparel';
  const showFashionCategory = showSubCategory && formState.subCategory === 'Fashion';
  const showSportsCategory = showSubCategory && formState.subCategory === 'Sports';
  const showWorkwearsCategory = showSubCategory && formState.subCategory === 'Workwears';
  const showSafetyWearsCategory = showSubCategory && formState.subCategory === 'Safety Wears';

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">Admin Access</h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold mb-4">Data Management</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Save your product list to Google Drive as a JSON file. This allows you to back up and manage your product data easily.
                </p>
                <button
                    onClick={handleSaveToDrive}
                    disabled={!isGapiReady || !tokenClient || isDriveSaving}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <CloudUploadIcon />
                    {isDriveSaving ? 'Saving...' : 'Save to Google Drive'}
                </button>
                {driveMessage && (
                    <p className="text-sm text-center mt-3 text-gray-700">{driveMessage}</p>
                )}
            </div>
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" value={formState.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input type="number" name="price" step="0.01" value={formState.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" value={formState.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kids">Kids</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Type</label>
                    <select name="productType" value={formState.productType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                        <option value="Footwear">Footwear</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>
                
                {showSubCategory && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Sub Category</label>
                        <select name="subCategory" value={formState.subCategory} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                            <option value="">Select Sub Category</option>
                            {apparelSubCategories[formState.category].map(sc => <option key={sc} value={sc}>{sc}</option>)}
                        </select>
                    </div>
                )}
                
                {showFashionCategory && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fashion Category</label>
                        <select name="fashionCategory" value={formState.fashionCategory} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                            <option value="">Select Fashion Category</option>
                            {fashionCategoryOptions[formState.category].map(fc => <option key={fc.path} value={fc.path}>{fc.name}</option>)}
                        </select>
                    </div>
                )}

                {showSportsCategory && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sports Category</label>
                        <select name="fashionCategory" value={formState.fashionCategory} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                            <option value="">Select Sports Category</option>
                            {sportsCategories.map(sc => <option key={sc.path} value={sc.path}>{sc.name}</option>)}
                        </select>
                    </div>
                )}

                {showWorkwearsCategory && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Workwear Category</label>
                        <select name="fashionCategory" value={formState.fashionCategory} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                            <option value="">Select Workwear Category</option>
                            {workwearsCategories.map(wc => <option key={wc.path} value={wc.path}>{wc.name}</option>)}
                        </select>
                    </div>
                )}

                {showSafetyWearsCategory && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Safety Wear Category</label>
                        <select name="fashionCategory" value={formState.fashionCategory} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                            <option value="">Select Safety Wear Category</option>
                            {safetywearsCategories.map(sc => <option key={sc.path} value={sc.path}>{sc.name}</option>)}
                        </select>
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <input 
                        type="file" 
                        name="images" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                    />
                    {formState.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {formState.images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img src={image} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove image"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                 
                <TagInput label="Colors" tags={formState.colors} setTags={(newTags) => setFormState(p => ({ ...p, colors: newTags }))} placeholder="Add color and press Enter" />
                <TagInput label="Sizes" tags={formState.sizes} setTags={(newTags) => setFormState(p => ({ ...p, sizes: newTags }))} placeholder="Add size and press Enter" />

                 <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" value={formState.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" required />
                </div>

                <TagInput label="Details" tags={formState.details} setTags={(newTags) => setFormState(p => ({ ...p, details: newTags }))} placeholder="Add detail and press Enter" />
                
                <div className="flex items-center space-x-4 pt-2">
                    <div className="flex items-center">
                        <input id="isNew" name="isNew" type="checkbox" checked={formState.isNew} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="isNew" className="ml-2 block text-sm text-gray-900">New Arrival</label>
                    </div>
                    <div className="flex items-center">
                        <input id="isBestSeller" name="isBestSeller" type="checkbox" checked={formState.isBestSeller} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="isBestSeller" className="ml-2 block text-sm text-gray-900">Best Seller</label>
                    </div>
                </div>

                <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                    Add Product
                </button>
            </form>
        </div>

        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Product List</h2>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{product.category} / {product.productType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-primary hover:text-blue-700">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="ml-4 text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;