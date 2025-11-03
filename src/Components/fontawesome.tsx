import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faCode, faLightbulb, faChalkboardTeacher, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faChartLine, faCogs, faPaintBrush } from '@fortawesome/free-solid-svg-icons';
import './fontawesome.css'; 

const IconComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState('fade-in');

  const items = [
    [
      { icon: faDesktop, title: "Code Mastery", description: "We offer comprehensive training in coding." },
      { icon: faCode, title: "Desktop Support", description: "Professional support for desktop systems." },
      { icon: faLightbulb, title: "Innovation", description: "Driving innovative solutions for clients." },
    ],
    [
      { icon: faChalkboardTeacher, title: "Learn GIS", description: "Training in Geographic Information Systems." },
      { icon: faGlobe, title: "Planning", description: "Strategic planning using GIS technologies." },
      { icon: faLightbulb, title: "Geographic Insights", description: "Providing insights through spatial analysis." },
    ],
    [
      { icon: faChartLine, title: "Data Analysis", description: "Comprehensive data analysis services." },
      { icon: faCogs, title: "Software Installations", description: "Seamless installation of software solutions." },
      { icon: faPaintBrush, title: "Designing", description: "Creative design services for various needs." },
    ],
    [
      { icon: faDesktop, title: "Networking", description: "Expert networking solutions for businesses." },
      { icon: faCogs, title: "System Integration", description: "Integrating systems for optimal performance." },
      { icon: faLightbulb, title: "Consulting", description: "Professional consulting for your projects." },
    ]
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeClass('fade-out'); 
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setFadeClass('fade-in'); 
      }, 1000); 
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="icon-container">
      <div className={`icon-items ${fadeClass}`} aria-hidden={fadeClass === 'fade-out'}>
        <div className="icon-row">
          {items[currentIndex].map((item, index) => (
            <div className="icon-item" key={index}>
              <FontAwesomeIcon icon={item.icon} size="1x" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconComponent;