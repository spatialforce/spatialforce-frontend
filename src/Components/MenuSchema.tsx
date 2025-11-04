import React from 'react';
import { Helmet } from 'react-helmet-async';

const MenuSchema = () => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://spatialforce.co.zw/#organization",
        "name": "Spatial Force",
        "url": "https://spatialforce.co.zw",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://spatialforce.co.zw/#logo",
          "url": "https://spatialforce.co.zw/logo.png",
          "width": 300,
          "height": 60,
          "caption": "Spatial Force Logo"
        },
        "description": "Zimbabwe's leading geospatial intelligence consultancy providing cutting-edge GIS solutions since 2022",
        "sameAs": [
          "https://www.facebook.com/spatialforce",
          "https://twitter.com/spatialforce",
          "https://www.linkedin.com/company/spatialforce"
        ],
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
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "17:00"
        },
        "priceRange": "$$",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "GIS Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Satellite Imagery Analysis",
                "description": "Advanced satellite data processing for environmental monitoring"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Geospatial Data Processing",
                "description": "AI-driven spatial analytics and predictive modeling"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "GIS Software Training",
                "description": "Comprehensive training programs for GIS professionals"
              }
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://spatialforce.co.zw/#website",
        "url": "https://spatialforce.co.zw",
        "name": "Spatial Force",
        "description": "Zimbabwe's premier geospatial intelligence solutions provider",
        "publisher": {
          "@id": "https://spatialforce.co.zw/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://spatialforce.co.zw/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://spatialforce.co.zw/#webpage",
        "url": "https://spatialforce.co.zw",
        "inLanguage": "en",
        "name": "Spatial Force - Zimbabwe's Leading Geospatial Intelligence Provider",
        "description": "Cutting-edge GIS solutions for environmental monitoring, urban planning and agricultural optimization",
        "isPartOf": {
          "@id": "https://spatialforce.co.zw/#website"
        },
        "about": {
          "@id": "https://spatialforce.co.zw/#organization"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://spatialforce.co.zw/assets/consultant-profile.jpg"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://spatialforce.co.zw/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://spatialforce.co.zw"
          }
        ]
      },
      {
        "@type": "Service",
        "name": "Climate Resilience Planning",
        "serviceType": "GIS Consulting",
        "provider": {
          "@type": "Organization",
          "name": "Spatial Force"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Zimbabwe"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Climate Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Flood Prediction Systems"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Microclimate Analysis"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Coastal Erosion Monitoring"
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
    </Helmet>
  );
};

export default MenuSchema;