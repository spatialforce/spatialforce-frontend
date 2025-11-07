import React, { useState,useEffect } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What services do you offer?",
      answer: "We offer a variety of GIS services, including mapping, spatial analysis, and data management."
    },
    {
      question: "How can I contact you?",
      answer: "You can contact us through our website or via WhatsApp for immediate assistance."
    },
    {
      question: "Where is your office located?",
      answer: "Our office is located in Bulawayo, Zimbabwe."
    },
    {
      question: "Do you offer training programs?",
      answer: "Yes, we provide training programs on GIS and remote sensing technologies."
    },
    {
      question: "What industries do you serve?",
      answer: "We serve various industries including agriculture, environmental management, and urban planning."
    },
    {
      question: "How can I get a quote for your services?",
      answer: "You can request a quote by filling out the contact form on our website."
    },
  ];

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  useEffect(() => {
    document.title = 'Spatial Force '; // Update the title
  }, []);


  return (
    <section className="faq-container">
      <h2 className="faq-heading">Frequently Asked Questions</h2>
      
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <article 
            className={`faq-card ${activeIndex === index ? 'active' : ''}`}
            key={index}
            aria-expanded={activeIndex === index}
          >
            <div 
              className="faq-question-container"
              onClick={() => handleToggle(index)}
              role="button"
              tabIndex="0"
              onKeyPress={(e) => e.key === 'Enter' && handleToggle(index)}
            >
              <div className="faq-indicator">
                <span className="faq-icon"></span>
              </div>
              <h3 className="faq-title">{faq.question}</h3>
            </div>
            
            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default FAQ;