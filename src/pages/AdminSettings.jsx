import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  fetchAdminSettings, 
  updateSettings, 
  updateCompanyInfo,
  selectSettings,
  selectSettingsLoading,
  selectSettingsUpdating,
  selectSettingsError,
  clearError
} from '../store/slices/settingsSlice';
import { uploadAPI } from '../services/api';
import ImageUpload from '../components/ImageUpload';
import '../styles/AdminSettings.css';

const AdminSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const isLoading = useSelector(selectSettingsLoading);
  const isUpdating = useSelector(selectSettingsUpdating);
  const error = useSelector(selectSettingsError);

  const [activeTab, setActiveTab] = useState('company');
  const [formData, setFormData] = useState({
    company: {
      name: '',
      tagline: '',
      description: '',
      logo: { url: '', publicId: '' },
      favicon: { url: '', publicId: '' }
    },
    contact: {
      phone: { primary: '', secondary: '', whatsapp: '' },
      email: { primary: '', support: '', sales: '' },
      address: { street: '', city: '', state: '', zipCode: '', country: 'India' }
    },
    socialMedia: {
      facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', pinterest: ''
    }
  });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setFormData({
        company: settings.company || formData.company,
        contact: settings.contact || formData.contact,
        socialMedia: settings.socialMedia || formData.socialMedia
      });
    }
  }, [settings]);

  useEffect(() => {
    if (error) {
      alert('Error: ' + error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [section, field, subfield] = name.split('.');
    
    setFormData(prev => {
      const newData = { ...prev };
      if (subfield) {
        newData[section] = {
          ...newData[section],
          [field]: {
            ...newData[section][field],
            [subfield]: value
          }
        };
      } else if (field) {
        newData[section] = {
          ...newData[section],
          [field]: value
        };
      } else {
        newData[section] = value;
      }
      return newData;
    });
  };

  const handleLogoUpload = async (uploadFormData) => {
    setIsUploadingLogo(true);
    try {
      const response = await uploadAPI.uploadSiteImage(uploadFormData);
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          logo: {
            url: response.data.url,
            publicId: response.data.publicId
          }
        }
      }));
    } catch (error) {
      console.error('Logo upload error:', error);
      alert('Failed to upload logo: ' + error.message);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'company') {
        await dispatch(updateCompanyInfo(formData.company)).unwrap();
      } else {
        await dispatch(updateSettings(formData)).unwrap();
      }
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update settings: ' + error);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company Info', icon: '🏢' },
    { id: 'contact', label: 'Contact Details', icon: '📞' },
    { id: 'social', label: 'Social Media', icon: '🌐' }
  ];

  if (isLoading) {
    return (
      <div className="admin-settings loading">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="admin-settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="settings-header">
        <h1>Site Settings</h1>
        <p>Manage your website's global settings and information</p>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          <form onSubmit={handleSubmit}>
            {activeTab === 'company' && (
              <div className="settings-section">
                <h2>Company Information</h2>
                
                <div className="form-group">
                  <label htmlFor="company.name">Company Name *</label>
                  <input
                    type="text"
                    id="company.name"
                    name="company.name"
                    value={formData.company.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company.tagline">Tagline</label>
                  <input
                    type="text"
                    id="company.tagline"
                    name="company.tagline"
                    value={formData.company.tagline}
                    onChange={handleInputChange}
                    placeholder="Your company tagline"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company.description">Description</label>
                  <textarea
                    id="company.description"
                    name="company.description"
                    value={formData.company.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of your company"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Company Logo</label>
                  <ImageUpload
                    onUpload={handleLogoUpload}
                    multiple={false}
                    label="Upload Company Logo"
                    existingImages={formData.company.logo.url ? [formData.company.logo.url] : []}
                    onRemove={() => setFormData(prev => ({
                      ...prev,
                      company: { ...prev.company, logo: { url: '', publicId: '' } }
                    }))}
                    isLoading={isUploadingLogo}
                  />
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="settings-section">
                <h2>Contact Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact.phone.primary">Primary Phone *</label>
                    <input
                      type="tel"
                      id="contact.phone.primary"
                      name="contact.phone.primary"
                      value={formData.contact.phone.primary}
                      onChange={handleInputChange}
                      required
                      placeholder="+91-9999999999"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact.phone.whatsapp">WhatsApp</label>
                    <input
                      type="tel"
                      id="contact.phone.whatsapp"
                      name="contact.phone.whatsapp"
                      value={formData.contact.phone.whatsapp}
                      onChange={handleInputChange}
                      placeholder="+91-9999999999"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact.email.primary">Primary Email *</label>
                    <input
                      type="email"
                      id="contact.email.primary"
                      name="contact.email.primary"
                      value={formData.contact.email.primary}
                      onChange={handleInputChange}
                      required
                      placeholder="info@company.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact.email.sales">Sales Email</label>
                    <input
                      type="email"
                      id="contact.email.sales"
                      name="contact.email.sales"
                      value={formData.contact.email.sales}
                      onChange={handleInputChange}
                      placeholder="sales@company.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact.address.street">Address</label>
                  <input
                    type="text"
                    id="contact.address.street"
                    name="contact.address.street"
                    value={formData.contact.address.street}
                    onChange={handleInputChange}
                    placeholder="Street address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact.address.city">City</label>
                    <input
                      type="text"
                      id="contact.address.city"
                      name="contact.address.city"
                      value={formData.contact.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact.address.state">State</label>
                    <input
                      type="text"
                      id="contact.address.state"
                      name="contact.address.state"
                      value={formData.contact.address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="settings-section">
                <h2>Social Media Links</h2>
                
                <div className="form-group">
                  <label htmlFor="socialMedia.facebook">Facebook</label>
                  <input
                    type="url"
                    id="socialMedia.facebook"
                    name="socialMedia.facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="socialMedia.instagram">Instagram</label>
                  <input
                    type="url"
                    id="socialMedia.instagram"
                    name="socialMedia.instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="socialMedia.linkedin">LinkedIn</label>
                  <input
                    type="url"
                    id="socialMedia.linkedin"
                    name="socialMedia.linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="socialMedia.youtube">YouTube</label>
                  <input
                    type="url"
                    id="socialMedia.youtube"
                    name="socialMedia.youtube"
                    value={formData.socialMedia.youtube}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/channel/yourchannel"
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="loading-spinner small"></div>
                    Updating...
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
