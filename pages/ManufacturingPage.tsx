import React from 'react';
import MockupGenerator from '../components/MockupGenerator';

const PageHeader: React.FC = () => (
    <div className="bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Manufacturing & Custom Orders</h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">Your vision, our expertise. Partner with Faskicks for premium quality athletic apparel and footwear manufacturing.</p>
        </div>
    </div>
);

// Icon components for ValueProposition
const QualityIcon = () => (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);

const ScaleIcon = () => (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6" />
    </svg>
);

const EthicsIcon = () => (
     <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c1.35 0 2.463-.453 3.22-1.256m-6.44 0A9.004 9.004 0 0112 3c1.35 0 2.463.453 3.22 1.256m-6.44 0A9.004 9.004 0 003.28 9.251M12 3c-1.35 0-2.463.453-3.22 1.256m6.44 0A9.004 9.004 0 0120.72 9.251M12 3a9.004 9.004 0 00-8.716 6.747M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
    </svg>
);

const DesignIcon = () => (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);


const ValueProposition: React.FC = () => (
    <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-primary">Why Choose Us</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The Faskicks Manufacturing Advantage</p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                    <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                           <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <QualityIcon />
                           </div>
                           Uncompromising Quality
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">We use state-of-the-art technology and premium materials to ensure every product meets the highest standards.</dd>
                    </div>
                    <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                           <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <ScaleIcon />
                           </div>
                           Scalable Production
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">From small-batch custom orders to large-scale production runs, our facilities are equipped to handle your needs.</dd>
                    </div>
                    <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                           <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <EthicsIcon />
                           </div>
                           Ethical Sourcing
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">We are committed to responsible and ethical practices throughout our entire supply chain.</dd>
                    </div>
                    <div className="relative pl-16">
                        <dt className="text-base font-semibold leading-7 text-gray-900">
                           <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <DesignIcon />
                           </div>
                           Collaborative Design
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-gray-600">Our expert design team works with you to bring your concepts to life, from initial sketch to final product.</dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
);

const ProcessOverview: React.FC = () => {
    const steps = [
        { 
            name: '1. Design & Consultation', 
            description: 'We start by understanding your vision, requirements, and brand identity.',
            image: 'https://images.unsplash.com/photo-1542491122-1b9399315860?q=80&w=800&auto=format&fit=crop'
        },
        { 
            name: '2. Sampling & Prototyping', 
            description: 'A physical sample is created for your approval to ensure every detail is perfect.',
            image: 'https://images.unsplash.com/photo-1582255716886-e970104a08c0?q=80&w=800&auto=format&fit=crop'
        },
        { 
            name: '3. Production & Quality Control', 
            description: 'Your order goes into full production with rigorous quality checks at every stage.',
            image: 'https://images.unsplash.com/photo-155782583a-72c4d0926296?q=80&w=800&auto=format&fit=crop'
        },
        { 
            name: '4. Delivery & Logistics', 
            description: 'We manage the final steps to ensure your products are delivered on time, every time.',
            image: 'https://images.unsplash.com/photo-1586528116311-08dd6c787228?q=80&w=800&auto=format&fit=crop'
        },
    ];
    return (
        <div className="bg-gray-100 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-center mb-16">Our Process: From Concept to Completion</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map(step => (
                        <div key={step.name} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:-translate-y-2 duration-300">
                            <img src={step.image} alt={step.name} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="font-semibold text-lg text-primary mb-2">{step.name}</h3>
                                <p className="text-gray-600 text-sm">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const InquiryForm: React.FC = () => (
    <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Start Your Custom Order</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">Fill out the form below, and our B2B team will get in touch with you shortly.</p>
            </div>
            <form className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">First name</label>
                        <div className="mt-2.5">
                            <input type="text" id="first-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">Last name</label>
                        <div className="mt-2.5">
                            <input type="text" id="last-name" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">Company</label>
                        <div className="mt-2.5">
                            <input type="text" id="company" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">Email</label>
                        <div className="mt-2.5">
                            <input type="email" id="email" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="product-type" className="block text-sm font-semibold leading-6 text-gray-900">Product Type</label>
                        <div className="mt-2.5">
                           <select id="product-type" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6">
                                <option>Footwear</option>
                                <option>Apparel</option>
                                <option>Accessories</option>
                                <option>Other</option>
                           </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="quantity" className="block text-sm font-semibold leading-6 text-gray-900">Minimum Order Quantity</label>
                        <div className="mt-2.5">
                            <input type="number" id="quantity" min="100" placeholder="e.g., 500" className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">Message</label>
                        <div className="mt-2.5">
                            <textarea id="message" rows={4} className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"></textarea>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button type="submit" className="block w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Submit Inquiry</button>
                </div>
            </form>
        </div>
    </div>
);


const ManufacturingPage: React.FC = () => {
    return (
        <>
            <PageHeader />
            <ValueProposition />
            <div id="mockup-generator" className="bg-gray-50 py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                  <h2 className="text-base font-semibold leading-7 text-primary">Interactive Design Studio</h2>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Visualize Your Product Instantly</p>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Use our AI-powered tool to generate a mockup of your desired apparel. Describe what you want, then customize it with colors, logos, and patterns to bring your vision to life.
                  </p>
                </div>
                <div className="mx-auto mt-16 max-w-6xl">
                  <MockupGenerator />
                </div>
              </div>
            </div>
            <ProcessOverview />
            <InquiryForm />
        </>
    );
};

export default ManufacturingPage;