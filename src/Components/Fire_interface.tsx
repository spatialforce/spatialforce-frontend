import React, { useState } from 'react';
import { Flame, MapPin, Phone, Clock, Droplet, BarChart3, Settings, AlertTriangle, CheckCircle, Navigation, FileText, Search, Filter, Download, Menu, X, TrendingUp, Users } from 'lucide-react';

// Mock data
const mockFires = [
  { id: 'FW-2026-001', lat: -17.8252, lng: 31.0335, severity: 'severe', status: 'active', address: '123 Herbert Chitepo St, Mbare', reporter: '+263 77 123 4567', time: '14:23:45', duration: '8 min', buildingType: 'Residential', description: 'Fire in residential house, spreading to neighboring shack' },
  { id: 'FW-2026-002', lat: -17.8350, lng: 31.0450, severity: 'moderate', status: 'responding', address: '45 Simon Mazorodze Rd', reporter: '+263 77 234 5678', time: '14:45:12', duration: '25 min', buildingType: 'Commercial', description: 'Kitchen fire at restaurant' },
  { id: 'FW-2026-003', lat: -17.8180, lng: 31.0280, severity: 'minor', status: 'attended', address: '78 Seke Rd', reporter: '+263 77 345 6789', time: '13:15:30', duration: '45 min', buildingType: 'Industrial', description: 'Small fire in warehouse - extinguished' }
];

const mockHighRiskZones = [
  { id: 1, name: 'Mbare Dense Settlement', fires: 8, risk: 'critical', population: 35000, structures: 4700 },
  { id: 2, name: 'Epworth Informal', fires: 6, risk: 'high', population: 28000, structures: 3200 }
];

function App() {
  const [activeView, setActiveView] = useState('map');
  const [selectedFire, setSelectedFire] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userType, setUserType] = useState('admin');
  const [showCitizenReport, setShowCitizenReport] = useState(false);

  const getSeverityColor = (severity) => {
    const colors = { minor: '#FCD34D', moderate: '#FB923C', severe: '#EF4444', critical: '#9333EA' };
    return colors[severity] || '#6B7280';
  };

  const getStatusIcon = (status) => {
    const icons = { active: '🔥', responding: '🚒', attended: '⚫' };
    return icons[status] || '❓';
  };

  // CITIZEN REPORT FORM
  const CitizenReportForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Flame className="text-red-500" />
              Report Fire Emergency
            </h2>
            <button onClick={() => setShowCitizenReport(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fire Severity *</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                <option>Select severity level</option>
                <option>🟡 Minor - Small fire, no immediate danger</option>
                <option>🟠 Moderate - Spreading, property at risk</option>
                <option>🔴 Severe - Major fire, multiple properties</option>
                <option>🟣 Critical - Life threatening, casualties</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Contact Number *</label>
              <input type="tel" placeholder="+263 77 123 4567" className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Address or landmark" className="flex-1 p-3 border border-gray-300 rounded-lg" />
                <button type="button" className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <MapPin size={20} />
                  GPS
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Coordinates: -17.8252, 31.0335 (auto-detected)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Building Type</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Industrial</option>
                <option>Vegetation/Bush</option>
                <option>Vehicle</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">People at Risk (Estimate)</label>
              <input type="number" placeholder="0" className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea rows="3" placeholder="What do you see? Any trapped people? Direction of spread?" className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo/Video (Optional)</label>
              <input type="file" accept="image/*,video/*" className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-2">
                <Flame size={20} />
                Submit Fire Report
              </button>
              <button type="button" onClick={() => setShowCitizenReport(false)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Emergency:</strong> For life-threatening situations, also call 999 or your local emergency number.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // FIRE DETAIL PANEL
  const FireDetailPanel = ({ fire }) => (
    <div className="bg-white border-l border-gray-200 w-96 h-full overflow-y-auto">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Fire Report {fire.id}</h3>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2" 
                  style={{backgroundColor: getSeverityColor(fire.severity) + '20', color: getSeverityColor(fire.severity)}}>
              {fire.severity.toUpperCase()}
            </span>
          </div>
          <button onClick={() => setSelectedFire(null)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="text-gray-600 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-500">Reported</p>
              <p className="font-semibold">{fire.time} ({fire.duration} ago)</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="text-gray-600 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold">{fire.address}</p>
              <p className="text-sm text-gray-600">{fire.lat}, {fire.lng}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="text-gray-600 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-500">Reporter Contact</p>
              <p className="font-semibold">{fire.reporter}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-gray-800">{fire.description}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Navigation size={18} />
            Recommended Response
          </h4>
          
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-900">🚒 Mbare Fire Station</span>
                <span className="text-sm text-blue-700 font-semibold">6 min ETA</span>
              </div>
              <p className="text-xs text-blue-700">Distance: 2.3 km</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">🚒 Central Fire Station (Backup)</span>
                <span className="text-sm text-gray-600">11 min ETA</span>
              </div>
              <p className="text-xs text-gray-600">Distance: 4.7 km</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Droplet size={18} />
            Nearest Water Points
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm p-2 bg-green-50 rounded">
              <span>💧 Hydrant H-247</span>
              <span className="text-green-700 font-medium">450m ✓</span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 bg-green-50 rounded">
              <span>💧 Borehole BP-89</span>
              <span className="text-green-700 font-medium">890m ✓</span>
            </div>
            <div className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
              <span>💧 Mukuvisi River</span>
              <span className="text-gray-600">1.2km</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Contextual Alerts</p>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• High fuel load area (dense settlement)</li>
              <li>• 47 structures within 50m radius</li>
              <li>• Wind: 15 km/h SE (may spread NW)</li>
              <li>• Last fire: 34 days ago nearby</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-2">
            <Flame size={20} />
            Dispatch Unit
          </button>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
            <Phone size={20} />
            Call Reporter
          </button>
          <button className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
            <Navigation size={20} />
            View Full Route
          </button>
          <button className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
            <CheckCircle size={20} />
            Mark as Attended
          </button>
        </div>
      </div>
    </div>
  );

  // MAP VIEW
  const MapView = () => (
    <div className="relative h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center p-8">
        <MapPin size={64} className="text-gray-400 mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-700 mb-2">Leaflet Map Will Load Here</p>
        <p className="text-gray-500">Fire markers, stations, water points, and risk zones</p>
        
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {mockFires.map(fire => (
            <div 
              key={fire.id} 
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedFire(fire)}
            >
              <div className="text-3xl mb-2">{getStatusIcon(fire.status)}</div>
              <p className="font-bold text-sm">{fire.id}</p>
              <p className="text-xs text-gray-600 truncate">{fire.address}</p>
              <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold" 
                    style={{backgroundColor: getSeverityColor(fire.severity) + '20', color: getSeverityColor(fire.severity)}}>
                {fire.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg">
        <h4 className="font-semibold mb-2 text-sm">Map Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2"><span>🔥</span><span>Active Fire</span></div>
          <div className="flex items-center gap-2"><span>🚒</span><span>Responding</span></div>
          <div className="flex items-center gap-2"><span>⚫</span><span>Attended</span></div>
          <div className="flex items-center gap-2"><span>🚒</span><span>Fire Station</span></div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-red-600"></div>
            <span>High Risk Zone</span>
          </div>
        </div>
      </div>
    </div>
  );

  // REPORTS VIEW
  const ReportsView = () => (
    <div className="p-6 overflow-y-auto h-full">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fire Reports</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <input type="text" placeholder="Search by ID, location, or reporter..." className="flex-1 p-3 border border-gray-300 rounded-lg" />
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Search size={18} />
          Search
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockFires.map(fire => (
              <tr key={fire.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{fire.id}</td>
                <td className="px-6 py-4 text-sm">{fire.time}</td>
                <td className="px-6 py-4 text-sm">{fire.address}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold" 
                        style={{backgroundColor: getSeverityColor(fire.severity) + '20', color: getSeverityColor(fire.severity)}}>
                    {fire.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{getStatusIcon(fire.status)} {fire.status}</td>
                <td className="px-6 py-4 text-sm">{fire.duration}</td>
                <td className="px-6 py-4 text-sm">
                  <button 
                    onClick={() => setSelectedFire(fire)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ANALYTICS VIEW
  const AnalyticsView = () => (
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="text-2xl font-bold mb-6">Fire Analytics & Insights</h2>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Total Fires (30 days)</p>
          <p className="text-3xl font-bold text-gray-900">47</p>
          <p className="text-sm text-green-600 mt-1">↓ 12% from last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
          <p className="text-3xl font-bold text-gray-900">8.5m</p>
          <p className="text-sm text-green-600 mt-1">↓ 2.3 min improved</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Lives Saved</p>
          <p className="text-3xl font-bold text-gray-900">23</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Property Saved</p>
          <p className="text-3xl font-bold text-gray-900">$340K</p>
          <p className="text-sm text-green-600 mt-1">↑ 18% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Fire Frequency by Ward</h3>
          <div className="space-y-3">
            {['Mbare (12)', 'Epworth (8)', 'Hatfield (6)', 'Glen View (5)', 'Highfield (4)'].map((ward, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm w-32">{ward}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: `${(12-i*2)*8}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Fire Causes</h3>
          <div className="space-y-3">
            {[
              {cause: 'Electrical Fault', count: 16, color: '#EF4444'},
              {cause: 'Cooking Accident', count: 13, color: '#F59E0B'},
              {cause: 'Arson', count: 7, color: '#8B5CF6'},
              {cause: 'Candle/Lamp', count: 6, color: '#3B82F6'},
              {cause: 'Unknown', count: 5, color: '#6B7280'}
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm w-32">{item.cause}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{width: `${item.count*6}%`, backgroundColor: item.color}}></div>
                </div>
                <span className="text-sm font-medium w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Temporal Patterns</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-gray-600 mb-2">{day}</p>
              <div className="bg-red-100 rounded p-4">
                <p className="text-2xl font-bold text-red-600">{5 + i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // HIGH RISK ZONES VIEW
  const HighRiskZonesView = () => (
    <div className="p-6 overflow-y-auto h-full">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">High Risk Zones</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add New Zone
        </button>
      </div>

      <div className="space-y-4">
        {mockHighRiskZones.map(zone => (
          <div key={zone.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {zone.name}
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                    {zone.risk.toUpperCase()}
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">Zone ID: HFL-00{zone.id}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">View on Map</button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Fires (12 months)</p>
                <p className="text-2xl font-bold text-gray-900">{zone.fires}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Population</p>
                <p className="text-2xl font-bold text-gray-900">{(zone.population/1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Structures</p>
                <p className="text-2xl font-bold text-gray-900">{zone.structures}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900">18m</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Recommended Interventions</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Install 4 additional fire hydrants</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>Clear fire break paths (3 corridors)</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>Community fire safety training</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-red-600 font-bold">!</span>
                  <span>Upgrade electrical infrastructure (urgent)</span>
                </div>
              </div>
              <button className="mt-4 w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                View Full Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // SETTINGS VIEW
  const SettingsView = () => (
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="text-2xl font-bold mb-6">System Settings</h2>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Fire Stations Management</h3>
          <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Fire Station
          </button>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Mbare Fire Station</p>
                <p className="text-sm text-gray-600">3 units, 2 available</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Central Fire Station</p>
                <p className="text-sm text-gray-600">5 units, 4 available</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Water Points Management</h3>
          <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Water Point
          </button>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Hydrant H-247</p>
                <p className="text-sm text-gray-600">Status: Functional ✓</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">SMS alerts for new fires</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">Email daily reports</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">WhatsApp notifications</span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">User Management</h3>
          <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add User
          </button>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-600">admin@firewatch.zw</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // MAIN LAYOUT
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <Flame size={32} className="text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FireWatch</h1>
                <p className="text-xs text-gray-500">Real-Time Fire Response System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded relative">
              <Bell size={24} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setUserType('citizen')}
                className={`px-4 py-2 rounded-lg font-medium ${userType === 'citizen' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Citizen View
              </button>
              <button 
                onClick={() => setUserType('admin')}
                className={`px-4 py-2 rounded-lg font-medium ${userType === 'admin' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Admin View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && userType === 'admin' && (
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <nav className="flex-1 p-4 space-y-2">
              <button 
                onClick={() => setActiveView('map')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'map' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <MapPin size={20} />
                Fire Map
              </button>
              <button 
                onClick={() => setActiveView('reports')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'reports' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FileText size={20} />
                Reports
              </button>
              <button 
                onClick={() => setActiveView('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'analytics' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <BarChart3 size={20} />
                Analytics
              </button>
              <button 
                onClick={() => setActiveView('zones')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'zones' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <AlertTriangle size={20} />
                Risk Zones
              </button>
              <button 
                onClick={() => setActiveView('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'settings' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Settings size={20} />
                Settings
              </button>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-red-900 mb-1">Active Fires</p>
                <p className="text-3xl font-bold text-red-600">3</p>
                <p className="text-xs text-red-700 mt-1">1 critical, 2 moderate</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {userType === 'citizen' && (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <Flame size={64} className="text-red-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-4">Report a Fire Emergency</h2>
                  <p className="text-gray-600 mb-8">
                    Help save lives by reporting fires in your area. Your report will be immediately sent to the nearest fire station.
                  </p>
                  <button 
                    onClick={() => setShowCitizenReport(true)}
                    className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 shadow-lg flex items-center gap-3 mx-auto"
                  >
                    <Flame size={24} />
                    Report Fire Now
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    For life-threatening emergencies, also call 999
                  </p>
                </div>
              </div>
            )}

            {userType === 'admin' && activeView === 'map' && <MapView />}
            {userType === 'admin' && activeView === 'reports' && <ReportsView />}
            {userType === 'admin' && activeView === 'analytics' && <AnalyticsView />}
            {userType === 'admin' && activeView === 'zones' && <HighRiskZonesView />}
            {userType === 'admin' && activeView === 'settings' && <SettingsView />}
          </div>

          {/* Fire Detail Side Panel */}
          {selectedFire && userType === 'admin' && <FireDetailPanel fire={selectedFire} />}
        </div>
      </div>

      {/* Citizen Report Form Modal */}
      {showCitizenReport && <CitizenReportForm />}
    </div>
  );
            }