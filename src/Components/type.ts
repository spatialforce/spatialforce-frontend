// types.ts

export interface FAQ {
    question: string;
    answer: string;
  }
  
  export interface ServiceDetails {
    cta: string; // Call to action
    duration: string; // Time taken to deliver the service
    targetAudience: string; // Who the service is intended for
    relatedServices: string[]; // Array of related services
    faqs: FAQ[]; // List of frequently asked questions
    certifications: string[]; // List of certifications related to the service
  }
  
  export interface Service {
    name: string; // Name of the service
    image: string; // Path to the service image
    price: number; // Price of the service
    description: string; // Description of the service
    icon: string; // Path to the service icon
    details: ServiceDetails; // Detailed information about the service
  }