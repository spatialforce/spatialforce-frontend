import React from 'react';
import { Helmet } from 'react-helmet';

const ContactSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://spatialforce.co.zw/#organization",
        "name": "Spatial Force",
        "url": "https://spatialforce.co.zw/",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://spatialforce.co.zw/#logo",
          "url": "https://spatialforce.co.zw/logo.png",
          "width": 300,
          "height": 60,
          "caption": "Spatial Force Logo"
        },
        "description": "Leading provider of geospatial solutions, GIS mapping and location intelligence services in Zimbabwe",
        "sameAs": [
          "https://www.facebook.com/spatialforce",
          "https://twitter.com/spatialforce",
          "https://www.linkedin.com/company/Kudzanai Chakavarika"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "17 Longhurst, Northlynne",
          "addressLocality": "Bulawayo",
          "addressRegion": "Matabeleland",
          "postalCode": "",
          "addressCountry": "ZW"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+263717428085",
          "contactType": "customer service",
          "email": "info@spatialforce.co.zw",
          "areaServed": "ZW",
          "availableLanguage": "en"
        },
        "founder": {
            "@type": "Person",
            "name": "Kudzanai Chakavarika"
          }
      },
      {
        "@type": "WebPage",
        "@id": "https://spatialforce.co.zw/contact/#webpage",
        "url": "https://spatialforce.co.zw/contact/",
        "name": "Contact Us | Spatial Force - Geospatial Solutions",
        "description": "Contact Spatial Force for geospatial solutionsfound by (Kudzanai Chakavarika) GIS mapping and expert support. Reach out via email, phone or live chat.",
        "isPartOf": {
          "@id": "https://spatialforce.co.zw/#website"
        },
        "breadcrumb": {
          "@id": "https://spatialforce.co.zw/contact/#breadcrumb"
        },
        "inLanguage": "en"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://spatialforce.co.zw/contact/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://spatialforce.co.zw/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact"
          }
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://spatialforce.co.zw/#localbusiness",
        "parentOrganization": {
          "@id": "https://spatialforce.co.zw/"
        },
        "name": "Spatial Force",
        "image": {
          "@id": "https://spatialforce.co.zw/#logo"
        },
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "17 Longhurst, Northlynne",
          "addressLocality": "Bulawayo",
          "addressRegion": "Matabeleland",
          "postalCode": "",
          "addressCountry": "ZW"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "-20.094090",
          "longitude": "28.596844"
        },
        "telephone": "+263717428085",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "08:00",
          "closes": "17:00"
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default ContactSchema;