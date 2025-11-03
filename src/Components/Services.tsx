import React, { useState,useEffect } from 'react';
import ServiceItem from './ServiceItem';
import Modal from './modal';
import './services.css';
import { serviceList } from './Services-list';

const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<typeof serviceList[0] | null>(null);
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    document.title = 'Services | Spatial Force - Geospatial Solutions'; // Update the title
  }, []);


  return (
    <div className='services-container'>
      <h1>Our Services</h1>
      <div className='services'>
        {serviceList.slice(0, showMore ? serviceList.length : 3).map((service) => (
          <ServiceItem 
            key={service.id}
            image={service.image}
            name={service.name}
            //price={service.price}
            description={service.description}
            onClick={() => setSelectedService(service)}
          />
        ))}
      </div>
      <button onClick={() => setShowMore(!showMore)} className="show-more-button">
        {showMore ? 'Show Less' : 'Show More'}
      </button>
      {selectedService && (
        <Modal 
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          image={selectedService.image}
          details={selectedService.details}
          name={selectedService.name}
         // price={selectedService.price}
          description={selectedService.description}
          id={selectedService.id}
        />
      )}
    </div>
  );
};

export default Services;