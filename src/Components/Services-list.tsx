import landUse from "../assets/environment.png";
import fireMap from "../assets/Fire-analysis.png";
import indicies from "../assets/indiciess.png";
import webDev from "../assets/Web-dev.png";
import webGIS from "../assets/web-application.png";
import API from "../assets/API.png";
import GEE from "../assets/GEE.png";
import database from "../assets/database.png";
import desktop from "../assets/desktop-support.png";
import dashbord from "../assets/dashboard.png";
import sourcing from "../assets/Sourcing.jpg";
import tutorial from "../assets/tutorial.png";
import hydrology from "../assets/hydrology.jpg"

export const serviceList = [
  {
    id: "web-dev", // Unique ID
    name: "Web Development",
    image: webDev,
    price: 100,
    description: "Transform your digital presence with tailored web applications designed for responsiveness and user engagement, perfectly aligned with your business goals.",
    icon: "icons/web-dev-icon.png",
    details: {
      cta: "Get Started",
      duration: "Delivered in 4 weeks",
      targetAudience: "Businesses, Startups",
      relatedServices: ["API Integration", "Web GIS"],
      faqs: [
        { question: "What technologies do you use?", answer: "We utilize React, Node.js, and other modern frameworks." },
      ],
     
    },
  },
  {
    id: "web-gis", // Unique ID
    name: "Web GIS",
    image: webGIS,
    price: 150,
    description: "Revolutionize your mapping capabilities by integrating GIS technology into your web applications, offering enhanced spatial analysis and user interactivity.",
    icon: "icons/web-gis-icon.png",
    details: {
      cta: "Request a Demo",
      duration: "Delivered in 5 weeks",
      targetAudience: "Web Developers, GIS Professionals",
      relatedServices: ["API Integration", "Web Development"],
      faqs: [
        { question: "What is Web GIS?", answer: "It's GIS technology integrated into web applications for mapping and spatial analysis." },
      ],
    
    },
  },
  {
    id: "desktop-support", // Unique ID
    name: "Desktop Support",
    image: desktop,
    price: 20,
    description: "Experience hassle-free technical support for your desktop applications, ensuring your systems run smoothly and efficiently.",
    icon: "icons/desktop-support-icon.png",
    details: {
      cta: "Get Support",
      duration: "Available 24/7",
      targetAudience: "Individuals, Small Businesses",
      relatedServices: ["Web Development"],
      faqs: [
        { question: "What support do you offer?", answer: "We assist with software issues, installations, and troubleshooting." },
      ],
   
    },
  },
  {
    id: "tutorials", // Unique ID
    name: "Tutorials",
    image: tutorial,
    price: 30,
    description: "Empower yourself with our comprehensive tutorials in GIS and remote sensing, designed to enhance your skills and understanding.",
    icon: "icons/tutorials-icon.png",
    details: {
      cta: "Enroll Now",
      duration: "Self-paced",
      targetAudience: "Students, Professionals",
      relatedServices: ["Web Development", "GIS Training"],
      faqs: [
        { question: "Are the tutorials online?", answer: "Yes, all tutorials are available online for your convenience." },
      ],

    },
  },
  {
    id: "api-integration", // Unique ID
    name: "API Integration",
    image: API,
    price: 200,
    description: "Streamline your operations with seamless API integration, connecting diverse systems for efficient data exchange and operational synergy.",
    icon: "icons/api-icon.png",
    details: {
      cta: "Get Started",
      duration: "Delivered in 3 weeks",
      targetAudience: "Businesses, Developers",
      relatedServices: ["Web Development", "Web GIS"],
      faqs: [
        { question: "What systems can you integrate?", answer: "We can integrate various web services and databases." },
      ],
  
    },
  },
  {
    id: "google-earth-engine", // Unique ID
    name: "Google Earth Engine (GEE)",
    image: GEE,
    price: 50,
    description: "Leverage the full potential of geospatial data analysis with our Google Earth Engine services, providing powerful insights for informed decision-making.",
    icon: "icons/gee-icon.png",
    details: {
      cta: "Contact Us",
      duration: "Delivered in 2 weeks",
      targetAudience: "Researchers, Environmental Analysts",
      relatedServices: ["Indices Calculation", "Land Use and Land Cover"],
      faqs: [
        { question: "What can GEE analyze?", answer: "GEE can analyze vast datasets for various environmental applications." },
      ],
      certifications: ["Google Earth Engine Certified"],
    },
  },
  {
    id: "land-use", // Unique ID
    name: "Land Use and Land Cover",
    image: landUse,
    price: 50,
    description: "Unlock valuable insights with our comprehensive analysis of land use patterns. Understand changes over time to make informed decisions for sustainable development.",
    icon: "icons/land-use-icon.png",
    details: {
      cta: "Get Started",
      duration: "Delivered in 2 weeks",
      targetAudience: "Urban Planners, Environmental Agencies",
      relatedServices: ["Indices Calculation", "Hydrology"],
      faqs: [
        { question: "What data do you need?", answer: "We require recent satellite imagery and local land use data." },
      ],
  
    },
  },
  {
    id: "fire-analysis", // Unique ID
    name: "Fire Analysis",
    image: fireMap,
    price: 80,
    description: "Mitigate risks with our advanced fire analysis services, identifying high-risk areas and leveraging historical data for effective prevention strategies.",
    icon: "icons/fire-analysis-icon.png",
    details: {
      cta: "Request a Quote",
      duration: "Delivered in 3 weeks",
      targetAudience: "Forestry Departments, Insurance Companies",
      relatedServices: ["Hydrology", "Land Use and Land Cover"],
      faqs: [
        { question: "How do you assess risk?", answer: "We analyze historical fire data and current vegetation patterns." },
      ],
    
    },
  },
  {
    id: "indices-calculation", // Unique ID
    name: "Indices Calculation",
    image: indicies,
    price: 50,
    description: "Enhance your environmental assessments with precise calculations of vegetation and water indices, ensuring optimal health monitoring.",
    icon: "icons/indices-icon.png",
    details: {
      cta: "Get Started",
      duration: "Delivered in 1 week",
      targetAudience: "Environmental Researchers, Ecologists",
      relatedServices: ["Land Use and Land Cover", "Hydrology"],
      faqs: [
        { question: "What indices can you calculate?", answer: "We can calculate NDVI, EVI, and various water indices." },
      ],
      certifications: ["Remote Sensing Analyst"],
    },
  },
  {
    id: "hydrology", // Unique ID
    name: "Hydrology",
    image: hydrology, 
    price: 80,
    description: "Navigate the intricacies of water resource management with our expert hydrology analysis, ensuring sustainable practices and effective watershed management.",
    icon: "icons/hydrology-icon.png",
    details: {
      cta: "Contact Us",
      duration: "Delivered in 4 weeks",
      targetAudience: "Environmental Agencies, Municipalities",
      relatedServices: ["Fire Analysis", "Land Use and Land Cover"],
      faqs: [
        { question: "What do you analyze?", answer: "We analyze water flow, quality, and resource distribution." },
      ],

    },
  },
  {
    id: "database-design", // Unique ID
    name: "Database Design",
    image: database,
    price: 100,
    description: "Optimize your data management with our expert database design services, ensuring efficiency and reliability in handling geospatial data.",
    icon: "icons/database-design-icon.png",
    details: {
      cta: "Get Started",
      duration: "Delivered in 3 weeks",
      targetAudience: "Businesses, Researchers",
      relatedServices: ["Data Sourcing", "Web Development"],
      faqs: [
        { question: "What database systems do you use?", answer: "We work with SQL, NoSQL, and cloud-based solutions." },
      ],
  
    },
  },
  {
    id: "data-sourcing", // Unique ID
    name: "Data Sourcing",
    image: sourcing,
    price: 20,
    description: "Gain access to critical data resources with our data sourcing services, tailored to meet the specific needs of your projects.",
    icon: "icons/data-sourcing-icon.png",
    details: {
      cta: "Request Data",
      duration: "Delivered in 1 week",
      targetAudience: "Researchers, Analysts",
      relatedServices: ["Database Design"],
      faqs: [
        { question: "What types of data can you source?", answer: "We can source satellite imagery, environmental data, and more." },
      ],
      certifications: ["Data Sourcing Specialist"],
    },
  },
  {
    id: "dashboards", // Unique ID
    name: "Dashboards",
    image: dashbord,
    price: 80,
    description: "Visualize your data effectively with our interactive dashboards, designed to facilitate insights and enhance decision-making processes.",
    icon: "icons/dashboards-icon.png",
    details: {
      cta: "Get Started",
      duration: "Delivered in 4 weeks",
      targetAudience: "Businesses, Data Analysts",
      relatedServices: ["Web Development", "API Integration"],
      faqs: [
        { question: "What tools do you use for dashboards?", answer: "We use Tableau, Power BI, and custom web solutions." },
      ],
  
    },
  },
];