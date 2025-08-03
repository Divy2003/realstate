import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createProject, updateProject, fetchProject } from '../store/slices/projectsSlice';
import { uploadAPI } from '../services/api';
import ImageUpload from '../components/ImageUpload';
import '../styles/AdminProjectForm.css';

const AdminProjectForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { currentProject, isCreating, isUpdating, error } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    location: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    status: 'upcoming',
    category: 'residential',
    startingPrice: '',
    maxPrice: '',
    totalUnits: '',
    heroImage: '',
    images: [],
    amenities: [],
    features: [],
    progress: '',
    specifications: {
      totalFloors: '',
      parkingSpaces: '',
      elevators: '',
      constructionArea: '',
      landArea: ''
    },
    timeline: {
      startDate: '',
      expectedCompletion: ''
    },
    developer: {
      name: '',
      contact: '',
      email: '',
      website: ''
    },
    isFeatured: false
  });

  const [newAmenity, setNewAmenity] = useState({ name: '', icon: '', description: '' });
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchProject(id));
    }
  }, [dispatch, isEditing, id]);

  useEffect(() => {
    if (isEditing && currentProject) {
      setFormData({
        title: currentProject.title || '',
        description: currentProject.description || '',
        shortDescription: currentProject.shortDescription || '',
        location: currentProject.location || '',
        address: {
          street: currentProject.address?.street || '',
          city: currentProject.address?.city || '',
          state: currentProject.address?.state || '',
          zipCode: currentProject.address?.zipCode || '',
          country: currentProject.address?.country || 'India'
        },
        status: currentProject.status || 'upcoming',
        category: currentProject.category || 'residential',
        startingPrice: currentProject.startingPrice || '',
        maxPrice: currentProject.maxPrice || '',
        totalUnits: currentProject.totalUnits || '',
        heroImage: currentProject.heroImage || '',
        images: currentProject.images || [],
        amenities: currentProject.amenities || [],
        features: currentProject.features || [],
        progress: currentProject.progress || '',
        specifications: {
          totalFloors: currentProject.specifications?.totalFloors || '',
          parkingSpaces: currentProject.specifications?.parkingSpaces || '',
          elevators: currentProject.specifications?.elevators || '',
          constructionArea: currentProject.specifications?.constructionArea || '',
          landArea: currentProject.specifications?.landArea || ''
        },
        timeline: {
          startDate: currentProject.timeline?.startDate ? new Date(currentProject.timeline.startDate).toISOString().split('T')[0] : '',
          expectedCompletion: currentProject.timeline?.expectedCompletion ? new Date(currentProject.timeline.expectedCompletion).toISOString().split('T')[0] : ''
        },
        developer: {
          name: currentProject.developer?.name || '',
          contact: currentProject.developer?.contact || '',
          email: currentProject.developer?.email || '',
          website: currentProject.developer?.website || ''
        },
        isFeatured: currentProject.isFeatured || false
      });
    }
  }, [isEditing, currentProject]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity.name.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, { ...newAmenity }]
      }));
      setNewAmenity({ name: '', icon: '', description: '' });
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleHeroImageUpload = async (formData) => {
    setIsUploadingHero(true);
    try {
      const response = await uploadAPI.uploadSiteImage(formData);
      setFormData(prev => ({
        ...prev,
        heroImage: response.data.url
      }));
    } catch (error) {
      console.error('Hero image upload error:', error);
      alert('Failed to upload hero image: ' + error.message);
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleProjectImagesUpload = async (formData) => {
    setIsUploadingImages(true);
    try {
      const response = await uploadAPI.uploadProjectImages(formData);
      const newImageUrls = response.data.files.map(file => file.url);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls]
      }));
    } catch (error) {
      console.error('Project images upload error:', error);
      alert('Failed to upload images: ' + error.message);
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const projectData = {
        ...formData,
        startingPrice: formData.startingPrice ? Number(formData.startingPrice) : undefined,
        maxPrice: formData.maxPrice ? Number(formData.maxPrice) : undefined,
        totalUnits: formData.totalUnits ? Number(formData.totalUnits) : undefined,
        specifications: {
          ...formData.specifications,
          totalFloors: formData.specifications.totalFloors ? Number(formData.specifications.totalFloors) : undefined,
          parkingSpaces: formData.specifications.parkingSpaces ? Number(formData.specifications.parkingSpaces) : undefined,
          elevators: formData.specifications.elevators ? Number(formData.specifications.elevators) : undefined,
          constructionArea: formData.specifications.constructionArea ? Number(formData.specifications.constructionArea) : undefined,
          landArea: formData.specifications.landArea ? Number(formData.specifications.landArea) : undefined
        }
      };

      if (isEditing) {
        await dispatch(updateProject({ id, projectData })).unwrap();
        alert('Project updated successfully!');
      } else {
        await dispatch(createProject(projectData)).unwrap();
        alert('Project created successfully!');
      }
      
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project: ' + error);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div
      className="admin-project-form"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-title">
              <h1>{isEditing ? 'Edit Project' : 'Create New Project'}</h1>
              <p>{isEditing ? 'Update project details' : 'Add a new project to your portfolio'}</p>
            </div>
            <div className="admin-actions">
              <button 
                type="button" 
                onClick={() => navigate('/admin/dashboard')}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="project-form">
            {/* Basic Information */}
            <div className="form-section">
              <h2>Basic Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">Project Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter project title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter project location"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="shortDescription">Short Description</label>
                <input
                  type="text"
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Brief description for cards and previews"
                  maxLength="200"
                />
              </div>
                            {/* Progress */}
                            <div className="form-group">
                <label htmlFor="progress">Progress (%)</label>
                <input
                  type="number"
                  id="progress"
                  name="progress"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={handleInputChange}
                  placeholder="0-100"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Detailed project description"
                  rows="4"
                  maxLength="2000"
                />
              </div>

              <div className="form-group full-width">
                <label>Hero Image *</label>
                <ImageUpload
                  onUpload={handleHeroImageUpload}
                  multiple={false}
                  label="Upload Hero Image"
                  existingImages={formData.heroImage ? [formData.heroImage] : []}
                  onRemove={() => setFormData(prev => ({ ...prev, heroImage: '' }))}
                  isLoading={isUploadingHero}
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  Featured Project
                </label>
              </div>
            </div>

            {/* Pricing & Units */}
            <div className="form-section">
              <h2>Pricing & Units</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="startingPrice">Starting Price</label>
                  <input
                    type="number"
                    id="startingPrice"
                    name="startingPrice"
                    value={formData.startingPrice}
                    onChange={handleInputChange}
                    placeholder="Starting price"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="maxPrice">Maximum Price</label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={formData.maxPrice}
                    onChange={handleInputChange}
                    placeholder="Maximum price"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="totalUnits">Total Units</label>
                  <input
                    type="number"
                    id="totalUnits"
                    name="totalUnits"
                    value={formData.totalUnits}
                    onChange={handleInputChange}
                    placeholder="Total number of units"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="form-section">
              <h2>Address Details</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="address.street">Street</label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Street address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.city">City</label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.state">State</label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="form-section">
              <h2>Timeline</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="timeline.startDate">Start Date</label>
                  <input
                    type="date"
                    id="timeline.startDate"
                    name="timeline.startDate"
                    value={formData.timeline.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="timeline.expectedCompletion">Expected Completion</label>
                  <input
                    type="date"
                    id="timeline.expectedCompletion"
                    name="timeline.expectedCompletion"
                    value={formData.timeline.expectedCompletion}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="form-section">
              <h2>Features</h2>
              <div className="features-section">
                <div className="add-feature">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button type="button" onClick={handleAddFeature} className="btn btn-secondary">
                    Add Feature
                  </button>
                </div>
                <div className="features-list">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Images */}
            <div className="form-section">
              <h2>Project Images</h2>
              <ImageUpload
                onUpload={handleProjectImagesUpload}
                multiple={true}
                maxFiles={10}
                label="Upload Project Images"
                existingImages={formData.images}
                onRemove={handleRemoveImage}
                isLoading={isUploadingImages}
              />
            </div>

            {/* Amenities */}
            <div className="form-section">
              <h2>Amenities</h2>
              <div className="amenities-section">
                <div className="add-amenity">
                  <input
                    type="text"
                    value={newAmenity.name}
                    onChange={(e) => setNewAmenity(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Amenity name"
                  />
                  <input
                    type="text"
                    value={newAmenity.icon}
                    onChange={(e) => setNewAmenity(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="Icon (emoji or class)"
                  />
                  <input
                    type="text"
                    value={newAmenity.description}
                    onChange={(e) => setNewAmenity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description"
                  />
                  <button type="button" onClick={handleAddAmenity} className="btn btn-secondary">
                    Add Amenity
                  </button>
                </div>
                <div className="amenities-list">
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span className="amenity-icon">{amenity.icon}</span>
                      <div className="amenity-details">
                        <strong>{amenity.name}</strong>
                        {amenity.description && <p>{amenity.description}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? (
                  <div className="loading-spinner"></div>
                ) : (
                  isEditing ? 'Update Project' : 'Create Project'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminProjectForm;
