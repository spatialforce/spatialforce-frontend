// AnimatedTicker.jsx
import React from 'react';
import './icon-animation.css'; 
import Icon1 from '../assets/icon1.svg'; 
import Icon2 from '../assets/icon2.svg'; 
import Icon3 from '../assets/icon3.svg'; 
import Icon4 from '../assets/icon4.svg'; 
import Icon5 from '../assets/icon5.svg'; 
import Icon6 from '../assets/icon6.svg'; 
import Icon7 from '../assets/icon7.svg'; 
import Icon8 from '../assets/icon8.svg'; 
import Icon9 from '../assets/icon9.svg'; 
import Icon10 from '../assets/icon10.svg'; 
import Icon11 from '../assets/icon11.svg';
import Icon12 from '../assets/icon12.svg';
import Icon13 from '../assets/icon13.svg';

const icons = [
    Icon1, Icon2, Icon3, Icon4, Icon5,
    Icon6, Icon7, Icon8, Icon9, Icon10, Icon11,Icon12,Icon13
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
                        <img key={index} className="icon" src={icon} alt={`Icon ${index + 1}`} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AnimatedTicker;