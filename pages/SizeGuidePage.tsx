import React, { useState } from 'react';

// Icons for "How to Measure" section
const BodyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const FootIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);


const sizeData = {
    men: {
        tops: [
            { size: 'S', chest: '35-37', waist: '29-31' },
            { size: 'M', chest: '38-40', waist: '32-34' },
            { size: 'L', chest: '41-43', waist: '35-37' },
            { size: 'XL', chest: '44-46', waist: '38-40' },
            { size: 'XXL', chest: '47-49', waist: '41-43' },
        ],
        bottoms: [
            { size: '28', waist: '28-29', hip: '34-35', inseam: '30' },
            { size: '30', waist: '30-31', hip: '36-37', inseam: '30-31' },
            { size: '32', waist: '32-33', hip: '38-39', inseam: '31-32' },
            { size: '34', waist: '34-35', hip: '40-41', inseam: '32-33' },
            { size: '36', waist: '36-37', hip: '42-43', inseam: '33' },
            { size: '38', waist: '38-40', hip: '44-45', inseam: '33-34' },
        ],
        footwear: [
            { us: 7, uk: 6, eu: 40, length: 9.8 },
            { us: 8, uk: 7, eu: 41, length: 10.2 },
            { us: 9, uk: 8, eu: 42, length: 10.5 },
            { us: 10, uk: 9, eu: 43, length: 10.8 },
            { us: 11, uk: 10, eu: 44, length: 11.2 },
            { us: 12, uk: 11, eu: 45, length: 11.5 },
        ]
    },
    women: {
        tops: [
            { size: 'XS (0-2)', bust: '31-32', waist: '24-25' },
            { size: 'S (4-6)', bust: '33-34', waist: '26-27' },
            { size: 'M (8-10)', bust: '35-36', waist: '28-29' },
            { size: 'L (12-14)', bust: '37-39', waist: '30-32' },
            { size: 'XL (16)', bust: '40-42', waist: '33-35' },
        ],
        bottoms: [
            { size: 'XS (0-2)', waist: '24-25', hips: '34-35', inseam: '29-30' },
            { size: 'S (4-6)', waist: '26-27', hips: '36-37', inseam: '30-31' },
            { size: 'M (8-10)', waist: '28-29', hips: '38-39', inseam: '31-32' },
            { size: 'L (12-14)', waist: '30-32', hips: '40-42', inseam: '32-33' },
            { size: 'XL (16)', waist: '33-35', hips: '43-45', inseam: '33-34' },
        ],
        footwear: [
            { us: 6, uk: 4, eu: 37, length: 9.2 },
            { us: 7, uk: 5, eu: 38, length: 9.5 },
            { us: 8, uk: 6, eu: 39, length: 9.8 },
            { us: 9, uk: 7, eu: 40, length: 10.2 },
            { us: 10, uk: 8, eu: 41, length: 10.5 },
        ]
    },
    kids: {
        clothing: [
            { age: '2T', height: '33-35', weight: '24-29 lbs' },
            { age: '3T', height: '36-38', weight: '30-34 lbs' },
            { age: '4T', height: '39-41', weight: '35-39 lbs' },
            { age: 'S (5-6)', height: '42-48', weight: '40-55 lbs' },
            { age: 'M (7-8)', height: '49-54', weight: '56-75 lbs' },
            { age: 'L (10-12)', height: '55-60', weight: '76-100 lbs' },
            { age: 'XL (14-16)', height: '61-64', weight: '101-125 lbs' },
        ],
        footwear: [
            { size: '10K', length: 6.5 },
            { size: '11K', length: 6.8 },
            { size: '12K', length: 7.2 },
            { size: '13K', length: 7.5 },
            { size: '1Y', length: 7.8 },
            { size: '2Y', length: 8.2 },
        ]
    }
};

const SizeGuidePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'men' | 'women' | 'kids'>('men');
    const [unit, setUnit] = useState<'in' | 'cm'>('in');

    const toCm = (inch: number) => (inch * 2.54).toFixed(1);
    const rangeToCm = (range: string) => {
        const parts = range.split('-');
        if (parts.length === 2) {
            const [min, max] = parts.map(Number);
            return `${toCm(min)} - ${toCm(max)}`;
        }
        return toCm(Number(parts[0]));
    };

    return (
        <div className="bg-white">
            <div className="bg-gray-100 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Find Your Perfect Fit</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Use our comprehensive guide to find the right size for your Faskicks gear.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl font-bold text-center mb-10">How to Measure</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold flex items-center mb-3"><BodyIcon /> Body Measurements</h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li><strong>Chest/Bust:</strong> Measure around the fullest part of your chest/bust, keeping the tape horizontal.</li>
                            <li><strong>Waist:</strong> Measure around your natural waistline, the narrowest part of your torso.</li>
                            <li><strong>Hips:</strong> Stand with your feet together and measure around the fullest part of your hips.</li>
                             <li><strong>Inseam:</strong> Measure a pair of well-fitting pants from the crotch seam to the bottom of the leg.</li>
                        </ul>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold flex items-center mb-3"><FootIcon /> Foot Measurements</h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li><strong>Length:</strong> Place your foot on a piece of paper and mark the tip of your longest toe and the back of your heel. Measure the distance between these two points.</li>
                        </ul>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-8 max-w-2xl mx-auto"><strong>Pro Tip:</strong> For best results, measure yourself in your undergarments. If you're between sizes, we recommend sizing up for a more relaxed fit or sizing down for a snugger fit.</p>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-center border-b pb-4 mb-8">
                    <div className="flex space-x-2 sm:space-x-4 border-b">
                        <button onClick={() => setActiveTab('men')} className={`py-2 px-4 text-sm sm:text-base font-medium ${activeTab === 'men' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Men</button>
                        <button onClick={() => setActiveTab('women')} className={`py-2 px-4 text-sm sm:text-base font-medium ${activeTab === 'women' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Women</button>
                        <button onClick={() => setActiveTab('kids')} className={`py-2 px-4 text-sm sm:text-base font-medium ${activeTab === 'kids' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Kids</button>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600 font-medium">Units:</span>
                        <button onClick={() => setUnit('in')} className={`px-3 py-1 rounded-md ${unit === 'in' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>in</button>
                        <button onClick={() => setUnit('cm')} className={`px-3 py-1 rounded-md ${unit === 'cm' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>cm</button>
                    </div>
                </div>

                {/* Men's Charts */}
                {activeTab === 'men' && (
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Men's Tops (T-Shirts, Hoodies, Jackets)</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 font-semibold">Size</th>
                                            <th className="p-3 font-semibold">Chest ({unit})</th>
                                            <th className="p-3 font-semibold">Waist ({unit})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.men.tops.map(row => (
                                            <tr key={row.size} className="border-b">
                                                <td className="p-3 font-medium">{row.size}</td>
                                                <td className="p-3">{unit === 'in' ? row.chest : rangeToCm(row.chest)}</td>
                                                <td className="p-3">{unit === 'in' ? row.waist : rangeToCm(row.waist)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Men's Bottoms (Pants, Shorts)</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 font-semibold">Size</th>
                                            <th className="p-3 font-semibold">Waist ({unit})</th>
                                            <th className="p-3 font-semibold">Hip ({unit})</th>
                                            <th className="p-3 font-semibold">Inseam ({unit})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.men.bottoms.map(row => (
                                            <tr key={row.size} className="border-b">
                                                <td className="p-3 font-medium">{row.size}</td>
                                                <td className="p-3">{unit === 'in' ? row.waist : rangeToCm(row.waist)}</td>
                                                <td className="p-3">{unit === 'in' ? row.hip : rangeToCm(row.hip)}</td>
                                                <td className="p-3">{unit === 'in' ? row.inseam : rangeToCm(row.inseam)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Men's Footwear</h3>
                             <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 font-semibold">Foot Length ({unit})</th>
                                            <th className="p-3 font-semibold">US Size</th>
                                            <th className="p-3 font-semibold">UK Size</th>
                                            <th className="p-3 font-semibold">EU Size</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.men.footwear.map(row => (
                                            <tr key={row.us} className="border-b">
                                                <td className="p-3 font-medium">{unit === 'in' ? row.length : toCm(row.length)}</td>
                                                <td className="p-3">{row.us}</td>
                                                <td className="p-3">{row.uk}</td>
                                                <td className="p-3">{row.eu}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {/* Women's Charts */}
                {activeTab === 'women' && (
                     <div className="space-y-12">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Women's Tops</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 font-semibold">Size</th>
                                            <th className="p-3 font-semibold">Bust ({unit})</th>
                                            <th className="p-3 font-semibold">Waist ({unit})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.women.tops.map(row => (
                                            <tr key={row.size} className="border-b">
                                                <td className="p-3 font-medium">{row.size}</td>
                                                <td className="p-3">{unit === 'in' ? row.bust : rangeToCm(row.bust)}</td>
                                                <td className="p-3">{unit === 'in' ? row.waist : rangeToCm(row.waist)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                         <div>
                            <h3 className="text-xl font-bold mb-4">Women's Bottoms</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 font-semibold">Size</th>
                                            <th className="p-3 font-semibold">Waist ({unit})</th>
                                            <th className="p-3 font-semibold">Hips ({unit})</th>
                                            <th className="p-3 font-semibold">Inseam ({unit})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.women.bottoms.map(row => (
                                            <tr key={row.size} className="border-b">
                                                <td className="p-3 font-medium">{row.size}</td>
                                                <td className="p-3">{unit === 'in' ? row.waist : rangeToCm(row.waist)}</td>
                                                <td className="p-3">{unit === 'in' ? row.hips : rangeToCm(row.hips)}</td>
                                                <td className="p-3">{unit === 'in' ? row.inseam : rangeToCm(row.inseam)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Women's Footwear</h3>
                             <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 font-semibold">Foot Length ({unit})</th>
                                            <th className="p-3 font-semibold">US Size</th>
                                            <th className="p-3 font-semibold">UK Size</th>
                                            <th className="p-3 font-semibold">EU Size</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.women.footwear.map(row => (
                                            <tr key={row.us} className="border-b">
                                                <td className="p-3 font-medium">{unit === 'in' ? row.length : toCm(row.length)}</td>
                                                <td className="p-3">{row.us}</td>
                                                <td className="p-3">{row.uk}</td>
                                                <td className="p-3">{row.eu}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {/* Kids' Charts */}
                 {activeTab === 'kids' && (
                     <div className="space-y-12">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Kids' Clothing</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 font-semibold">Age/Size</th>
                                            <th className="p-3 font-semibold">Height ({unit})</th>
                                            <th className="p-3 font-semibold">Weight</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.kids.clothing.map(row => (
                                            <tr key={row.age} className="border-b">
                                                <td className="p-3 font-medium">{row.age}</td>
                                                <td className="p-3">{unit === 'in' ? row.height : rangeToCm(row.height)}</td>
                                                <td className="p-3">{row.weight}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Kids' Footwear</h3>
                             <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 font-semibold">US Size</th>
                                            <th className="p-3 font-semibold">Foot Length ({unit})</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeData.kids.footwear.map(row => (
                                            <tr key={row.size} className="border-b">
                                                <td className="p-3 font-medium">{row.size}</td>
                                                <td className="p-3">{unit === 'in' ? row.length : toCm(row.length)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SizeGuidePage;