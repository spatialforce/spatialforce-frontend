// AnimatedTicker.jsx
import React from 'react';
import './icon-animation.css'; 

const icons = [
    "/images/icon1.svg", 
    "/images/icon2.svg", 
    "/images/icon3.svg", 
    "/images/icon4.svg", 
    "/images/icon5.svg", 
    "/images/icon6.svg", 
    "/images/icon7.svg", 
    "/images/icon8.svg", 
    "/images/icon9.svg", 
    "/images/icon10.svg", 
    "/images/icon11.svg",
    "/images/icon12.svg",
    "/images/icon13.svg"
];

const AnimatedTicker = () => {
    
    const repeatedIcons = Array(100).fill(icons).flat();

    return (
        <section className="icon-ticker-section">
            <h2 className="ticker-title">Technologies and Software We Master</h2>
            <p className="ticker-description">
                We are proficient in a diverse array of cutting-edge technologies and sophisticated software that empower us in crafting exceptional web designs and conducting advanced GIS analyses. Our expertise extends beyond mere application; we are passionate about sharing our knowledge and can provide comprehensive training in these tools and technologies. Below is a selection of the instruments that enable us to deliver innovative solutions tailored to our clients' needs.
            </p>
            <div className="icon-ticker">
                <div className="icon-wrapper">
                    {repeatedIcons.map((icon, index) => (
                        <img 
                            key={index} 
                            className="icon" 
                            src={icon} 
                            alt={`Technology icon ${index + 1}`}
                            width="50"
                            height="50"
                            loading="lazy"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AnimatedTicker;