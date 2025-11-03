import React from 'react';
import { Helmet } from 'react-helmet-async';
import './ForestArticle.css';
import gwaaiImage from '../assets/gwaai.png';
import bembesiImage from '../assets/bembesi.png';
import kaviraImage from '../assets/kavira.png';
import lakeAliceImage from '../assets/lake alice.png';
import gwampaImage from '../assets/gwampa.png';
import insezeImage from '../assets/inseze extension.png';
import chesaImage from '../assets/chesa.png';
import landUseMap from '../assets/forest.jpg';
import FooterNote from './Footernote';

interface Forest {
  id: number;
  name: string;
  image: string;
  location: string;
  area: string;
  remainingCover: string;
  boundaryDescription: React.ReactNode;
  keyFeatures: string[];
  majorThreats: string[];
  conservationStatus: string;
  humanEncroachment: string;
}

const MatabelelandGazetteForests = () => {
  const forests: Forest[] = [
    {
      id: 1,
      name: 'Gwaai Forest',
      image: gwaaiImage,
      location: 'Matabeleland North (along Bulawayo-Victoria Falls Road)',
      area: '144,265 hectares',
      remainingCover: '127,880.06 hectares (88.6%) as of 2024',
      boundaryDescription: (
        <div>
          <p>Area bounded from Pioneer Block East SW beacon to Franklands Farm, along Umguza/Gwaai Rivers to Gutamegwa, Railway Strip 244 Matupula, Sunbeam, Melrose, and back via Bembezi River to Bulawayo-Victoria Falls Road.</p>
          <ul className="boundary-points">
            <li>Settlements:  along Gwayi River and Mbembesi River</li>
           
    
          </ul>
        </div>
      ),
      keyFeatures: [
        'One of largest reserve forests in Matabeleland North',
        'Bisected by Bulawayo-Victoria Falls Road',
        'Contains sections of Gwayi and Mbembesi rivers'
      ],
      majorThreats: [
        '16,061.60ha under cultivation with homesteads',
        '322.80ha lost to powerline buffer clearance',
        'Ongoing vegetation clearance for Gwaai-Shangani pipeline',
        'Riverine settlements along Gwayi and Mbembesi rivers'
      ],
      conservationStatus: 'Major Reserve Forest',
      humanEncroachment: 'Total loss: 16,061.60ha to cultivation/homesteads + 322.80ha to powerlines. Ongoing pipeline clearance.'
    },
    {
      id: 2,
      name: 'Bembesi Forest Reserve',
      image: bembesiImage,
      location: 'Bubi District (southeast forms Umguza District boundary)',
      area: '55,100 hectares',
      remainingCover: '47,506 hectares (86.2%)',
      boundaryDescription: (
        <div>
          <p>Area bounded from Pioneer Block East SE beacon to Westgate, along Bembezi River to Glenarton West, Nthobi Ranch, Eland Block, Franklands Farm, and back to starting point.</p>
          <ul className="boundary-points">
            <li>Northern boundary: Cultivation along Mbembesi River (west-east)</li>
            <li>Southeast boundary: Adjacent to Umguza District</li>
          </ul>
        </div>
      ),
      keyFeatures: [
        'Major riverine forest along Mbembesi River',
        'Cross-district boundary between Bubi and Umguza'
      ],
      majorThreats: [
        '7,539.10ha affected by cultivation',
        'Riverine settlements along Mbembesi River',
        'Northern boundary encroachment'
      ],
      conservationStatus: 'Forest Reserve',
      humanEncroachment: '7,539.10 hectares converted to cultivation and settlements, primarily along Mbembesi River and northern boundary'
    },
    {
      id: 3,
      name: 'Kavira Forest',
      image: kaviraImage,
      location: 'Binga District',
      area: '28,200 hectares',
      remainingCover: '28,013.44 hectares remaining (99.3%)',
      boundaryDescription: (
        <div>
          <p>Area bounded by line from Mlibizi River into Lake Kariba, south to Liwando River, southwest to game-fence at 35KNL074050, to MK861922 on Gwai River, north to Lake Kariba full-supply level.</p>
          <ul className="boundary-points">
            <li>Least affected gazetted forest</li>
            <li>References: 1:50,000 maps Masutu 1827A1 & Boma 1826B2</li>
          </ul>
        </div>
      ),
      keyFeatures: [
        'Minimal human impact compared to other forests',
        'Well-preserved boundary integrity'
      ],
      majorThreats: [
        'Minor cultivation encroachment'
      ],
      conservationStatus: 'Gazetted Forest',
      humanEncroachment: 'Only 186.5 hectares lost to cultivation'
    },
    {
      id: 4,
      name: 'Lake Alice Forest',
      image: lakeAliceImage,
      location: 'Southern boundary of Nkayi District',
      area: '39,000 hectares',
      remainingCover: '34,765.60 hectares (89.1%) as of 2024',
      boundaryDescription: (
        <div>
          <p>Northern boundary has lost 3,420.6 hectares to human settlements and cultivation affecting Lake Alice Dam's water retention capacity.</p>
          <ul className="boundary-points">
            <li>Encroachment along northern and Southern edge of the forest reserve area</li>
            <li>Visible conversion of forest to farmland</li>
            <li>Impact on watershed feeding Lake Alice Dam</li>
          </ul>
        </div>
      ),
      keyFeatures: [
        'Critical watershed for Lake Alice Dam',
        'Significant woodland area in Nkayi District',
        'Dam water retention declining due to forest loss'
      ],
      majorThreats: [
        '3,420.6 hectares converted to agriculture/settlements',
        'Northern & Southern boundary encroachment',
        'Reduced water retention in Lake Alice Dam'
      ],
      conservationStatus: 'Under severe pressure from human activities',
      humanEncroachment: '3,420.6 hectares lost primarily to cultivation and settlements'
    },
    {
      id: 5,
      name: 'Gwampa Forest',
      image: gwampaImage,
      location: 'Matebeleland Nkayi District (shares boundary with Lake Alice)',
      area: '47,000 hectares',
      remainingCover: '43,579.82 hectares remaining',
      boundaryDescription: (
        <div>
          <p>Area bounded by Gwampa River from map reference 35KPJ992752 south to Kenilworth Block at 35KQJ000699, 
            then southwest to Goodwood Block at 35KPJ510811, north to Gwampa River at PJ509904.</p>
          <ul className="boundary-points">
            <li>Primary encroachment: East to southeast sections</li>
            <li>Adjacent to Lake Alice Forest boundary</li>
          </ul>
        </div>
      ),
      keyFeatures: [
        'Shares watershed with Lake Alice Forest'
      ],
      majorThreats: [
        'Human encroachment in eastern/southeastern sections'
      ],
      conservationStatus: 'Forest Commission of Zimbabwe Conservation and Extension Unit',
      humanEncroachment: '3,420.18 hectares lost (total area: 47,000 ha)'
    },
    {
      id: 6,
      name: 'Inseze Extension',
      image: insezeImage,
      location: 'Western side of Umguza District',
      area: '8,400 hectares',
      remainingCover: '7,928 hectares remaining (94.4%)',
      boundaryDescription: (
        <div>
          <p>Area bounded by line from Seafield Valley's western beacon southeast to its southern beacon, southwest to Khami River, down river to Seafield Estate boundary.</p>
          <ul className="boundary-points">
            <li>Primary loss due to cultivation activities</li>
          </ul>
        </div>
      ),
      keyFeatures: [
        'Relatively well-preserved forest cover'
      ],
      majorThreats: [
        'Cultivation encroachment'
      ],
      conservationStatus: 'Protected Forest Area',
      humanEncroachment: '514.89 hectares lost to cultivation'
    },
    {
      id: 7,
      name: 'Chesa Forest',
      image: chesaImage,
      location: 'Umguza District',
      area: '14,250 hectares',
      remainingCover: '12,915 hectares remaining',
      boundaryDescription: (
        <div>
          <p>Area bounded by line from Compensation's SW beacon east to Bongolo, north to Caithness, southeast to Imvani, south to Mandau, southwest to Naseby, northwest to starting point.</p>
          <ul className="boundary-points">
            <li>Primary encroachment: Southwest and northeast ends</li>
            <li>Contains 135 hectares of eucalyptus plantations</li>
          </ul>
        </div>
      ),
      keyFeatures: [
        'Includes 135 hectares of eucalyptus plantations'
      ],
      majorThreats: [
        'Human cultivation encroachment',
        'Settlement expansion'
      ],
      conservationStatus: 'Protected Forest Area',
      humanEncroachment: '199.83 hectares lost (total area: 14,250 ha)'
    }
  ];

  return (
    <div className="forests-container">
      <Helmet>
        <title>Complete Matabeleland Gazette Forests Documentation | Spatial Force</title>
        <meta 
          name="description" 
          content="Detailed boundary maps, conservation status, and threat analysis for all 7 protected forests in Matabeleland" 
        />
        <meta name="keywords" content="Gwaai Forest, Bembesi Forest, Kavira Forest, Lake Alice Forest, Gwampa Forest, Inseze Extension, Chesa Forest, Zimbabwe protected areas" />
      </Helmet>

      <header className="article-header">
        <h1>Matabeleland  North Gazette Forests</h1>
        <p className="subtitle">Complete Boundary Documentation & Conservation Status</p>
        <div className="meta">
          <span>Kudzanai Chakavarika</span>
          <span> {new Date().toLocaleDateString()}</span>
        </div>
      </header>

      <div className="overview-map">
        <img 
          src={landUseMap} 
          alt="Composite map of Matabeleland forests"
          className="land-use-map"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      </div>

      <section className="forest-intro">
        <p>
        This official document provides complete boundary descriptions, conservation status, 
    and threat assessments for seven gazetted forests in Matabeleland province. 
    Kindly note that some forests are missing from this documentation - we are working 
    tirelessly to gather more information about additional gazetted forests and will 
    update this resource as new data becomes available. All maps and information 
    were produced by Spatial Force in collaboration with Chesa Research Station, 
    and all content complies with the Forest Act [Chapter 19:05]
    .If you have additional information that could improve 
    this resource, please feel free to contact us so we can enhance this website 
    to better serve all stakeholders
        </p>
      </section>

      <div className="forests-list">
        {forests.map(forest => (
          <article key={forest.id} className="forest-card">
            <div className="forest-visuals">
              <img
                src={forest.image}
                alt={`Current aerial view of ${forest.name}`}
                className="forest-image"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <p className="image-caption">Fig {forest.id}: {forest.name} Boundary Map</p>
            </div>
            
            <div className="forest-content">
              <h2>{forest.name}</h2>
              
              <div className="quick-facts">
                <p><strong>Location:</strong> {forest.location}</p>
                <p><strong>Total Area:</strong> {forest.area}</p>
                <p><strong>Remaining Forest:</strong> {forest.remainingCover}</p>
                <p><strong>Legal Status:</strong> {forest.conservationStatus}</p>
              </div>

              <div className="boundary-section">
                <h3>Boundary Description</h3>
                <div className="boundary-description">
                  {forest.boundaryDescription}
                </div>
              </div>

              <div className="ecology-section">
                <div className="features">
                  <h3>Key Ecological Features</h3>
                  <ul>
                    {forest.keyFeatures.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="threats">
                  <h3>Major Threats</h3>
                  <ul>
                    {forest.majorThreats.map((threat, i) => (
                      <li key={i}>{threat}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="human-impact">
                <h3>Human Encroachment</h3>
                <p>{forest.humanEncroachment}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <footer className="article-footer">
        <p>
          <strong>Data Source:</strong> Forestry Commission of Zimbabwe - Chesa Research Station (2024 Survey)
        </p>
        <p>
          <strong>Maps Reference:</strong> 1:50,000 Topographic Series (Surveyor-General)
        </p>
      </footer>
      <FooterNote/>
    </div>
  );
};

export default MatabelelandGazetteForests;