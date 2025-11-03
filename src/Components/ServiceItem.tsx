import React from 'react';
import './services.css'

interface ServiceItemProps {
  image: string;
  name: string;
  description: string;
  price: number;
  onClick: () => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  image,
  name,
  description,
  price,
  onClick,
}) => {
  const maxLength = 100;

  const truncateDescription = (desc: string, maxLength: number): string => {
    return desc.length > maxLength ? `${desc.slice(0, maxLength)}...` : desc;
  };

  return (
    <div className="service-item" onClick={onClick} role="button" tabIndex={0}>
      {image && (
        <img 
          src={image} 
          alt={name} 
          className="service-image" 
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <h3 className="service-name">{name}</h3>
      <p className="item-description">{truncateDescription(description, maxLength)}</p>
     {/*<p className="price">${price.toFixed(2)}</p>*/}
    </div>
  );
};

export default ServiceItem;