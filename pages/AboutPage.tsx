import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedDiv from '../components/AnimatedDiv';

// Icon Components for values
const InnovationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const QualityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const CommunityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
);

const faqData = [
  {
    question: "What is your shipping policy?",
    answer: "We offer standard shipping (5-7 business days) for a flat rate of $5 and free shipping for all orders over $50. Expedited shipping options are also available at checkout for an additional fee."
  },
  {
    question: "How do I return an item?",
    answer: "We offer easy, hassle-free 30-day returns. Items must be in new, unworn condition with the original tags attached. To start a return, please visit our Returns Portal on our website and follow the instructions."
  },
  {
    question: "Can I track my order?",
    answer: "Yes! As soon as your order ships, you will receive a shipping confirmation email with a tracking number. You can use this number to track your package's journey to your doorstep."
  },
  {
    question: "Do you offer custom manufacturing for teams or businesses?",
    answer: "Absolutely! We specialize in custom manufacturing for sports teams, corporate clients, and fashion brands. Please visit our Manufacturing page to learn more about our capabilities and to submit an inquiry to our B2B team."
  },
  {
    question: "How do I find the right size?",
    answer: "We recommend checking out our comprehensive Size Guide, which includes detailed measurement instructions and charts for all our products. You can find a link to the Size Guide on every product page and in our website's footer."
  }
];

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-white py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedDiv className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-dark sm:text-4xl">Frequently Asked Questions</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
                    </p>
                </AnimatedDiv>
                <div className="mt-12 max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <AnimatedDiv key={index} staggerIndex={index}>
                                <div className="border-b border-gray-200 py-4">
                                    <button
                                        className="w-full flex justify-between items-center text-left text-lg font-semibold text-dark"
                                        onClick={() => toggleFAQ(index)}
                                        aria-expanded={openIndex === index}
                                        aria-controls={`faq-answer-${index}`}
                                    >
                                        <span>{faq.question}</span>
                                        <span>{openIndex === index ? <MinusIcon /> : <PlusIcon />}</span>
                                    </button>
                                    <div
                                        id={`faq-answer-${index}`}
                                        className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="pt-4 text-gray-600">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedDiv>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const AboutPage: React.FC = () => {
    const manufacturingItems = [
        { title: "Collaborative Design", description: "Our experts work with you to refine your concepts into production-ready designs.", image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2070&auto=format&fit=crop", alt: "Design collaboration" },
        { title: "Precision Manufacturing", description: "Using state-of-the-art technology, we ensure every product is crafted to the highest standard.", image: "https://images.unsplash.com/photo-1533476082928-a594b22c7554?q=80&w=2070&auto=format&fit=crop", alt: "Precision manufacturing" },
        { title: "Quality Packing & Delivery", description: "We handle the final details, ensuring your custom order is packed and delivered perfectly.", image: "https://images.unsplash.com/photo-1586528116311-08dd6c787228?q=80&w=2070&auto=format&fit=crop", alt: "Quality packing and delivery" }
    ];

    const values = [
        { icon: <InnovationIcon />, title: "Innovation", description: "We constantly research and develop new materials and technologies to enhance performance." },
        { icon: <QualityIcon />, title: "Uncompromising Quality", description: "From raw materials to finished products, we are obsessed with quality and durability." },
        { icon: <CommunityIcon />, title: "Community", description: "We support athletes and teams at all levels, fostering a global community of sports lovers." }
    ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f56?q=80&w=2070&auto=format&fit=crop"
          alt="Athlete tying shoelaces"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">About Faskicks Sports</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl">
            More than just a brand. We are a community driven by passion, performance, and the pursuit of excellence.
          </p>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedDiv className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dark sm:text-4xl">Our Story</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Faskicks Sports was born from a simple idea: to create high-quality, performance-driven athletic gear that doesn't compromise on style. Founded by a team of athletes and designers, we saw a need for sportswear that could keep up with the demands of intense training while looking great on the street. We believe that what you wear should empower you to push your limits and achieve your goals. Every stitch, every fabric, and every design is a testament to our commitment to quality and innovation.
          </p>
        </AnimatedDiv>
      </div>

      {/* Custom Manufacturing Section */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedDiv className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-dark sm:text-4xl">Your Vision, Our Expertise</h2>
                <p className="mt-4 text-lg text-gray-600">
                    We are proud to manufacture all types of clothing with complete customization, from initial design to final packaging. Whether you're a sports team, a corporation, or a fashion brand, we bring your ideas to life.
                </p>
            </AnimatedDiv>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {manufacturingItems.map((item, index) => (
                    <AnimatedDiv key={item.title} staggerIndex={index} className="flex flex-col items-center">
                        <img src={item.image} alt={item.alt} className="w-full h-64 object-cover rounded-lg shadow-md mb-4"/>
                        <h3 className="text-xl font-semibold text-dark">{item.title}</h3>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                    </AnimatedDiv>
                ))}
            </div>
             <AnimatedDiv className="text-center mt-12">
                <Link to="/manufacturing" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-blue-600 transition-colors">
                    Learn More About Manufacturing
                </Link>
            </AnimatedDiv>
        </div>
      </div>


      {/* Our Values Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedDiv className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-dark sm:text-4xl">Our Core Values</h2>
          <p className="mt-4 text-lg text-gray-600">
            The principles that guide every decision we make.
          </p>
        </AnimatedDiv>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-12">
          {values.map((value, index) => (
             <AnimatedDiv key={value.title} staggerIndex={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-dark">{value.title}</h3>
                <p className="mt-2 text-gray-600">{value.description}</p>
            </AnimatedDiv>
          ))}
        </div>
      </div>
      
      <FAQSection />

    </div>
  );
};

export default AboutPage;
