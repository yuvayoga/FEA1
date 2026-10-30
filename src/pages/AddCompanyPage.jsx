import { useState, useRef, useId, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  UserRound,
  Globe2,
  Mail,
  Upload,
  Search,
  Settings,
  Lock,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import '../App.css';

const countries = [
  ['ARE', 'United Arab Emirates'],
  ['AUS', 'Australia'],
  ['BRA', 'Brazil'],
  ['CAN', 'Canada'],
  ['CHN', 'China'],
  ['DEU', 'Germany'],
  ['ESP', 'Spain'],
  ['FRA', 'France'],
  ['GBR', 'United Kingdom'],
  ['IND', 'India'],
  ['IRL', 'Ireland'],
  ['ITA', 'Italy'],
  ['JPN', 'Japan'],
  ['KOR', 'South Korea'],
  ['MEX', 'Mexico'],
  ['NLD', 'Netherlands'],
  ['SGP', 'Singapore'],
  ['SWE', 'Sweden'],
  ['USA', 'United States'],
  ['ZAF', 'South Africa'],
];

const VALID_COUNTRY_CODES = new Set(countries.map(([code]) => code));
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const initialFormData = {
  company: '',
  contact: '',
  country: '',
  email: '',
};

function CyberField({ icon: Icon, label, id, children }) {
  return (
    <div className="df-field">
      <label htmlFor={id}>
        {label} <b>*</b>
      </label>
      <div className="df-input-shell">
        <Icon size={16} />
        {children}
      </div>
    </div>
  );
}

CyberField.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default function AddCompanyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const companyId = useId();
  const contactId = useId();
  const countryId = useId();
  const emailId = useId();

  const [formData, setFormData] = useState(initialFormData);
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Performance optimized: One-time smooth entrance sequence (no infinite loops = zero lag!)
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroPlaying(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Validation rules
  const isCompanyValid = formData.company.trim().length > 0;
  const isContactValid = formData.contact.trim().length > 0;
  const isCountryValid = VALID_COUNTRY_CODES.has(formData.country);
  const isEmailValid = EMAIL_REGEX.test(formData.email.trim());
  const isLogoValid = logo !== null && logo.file !== undefined;

  // Submit enabled only when all 5 validations pass
  const isFormValid =
    isCompanyValid && isContactValid && isCountryValid && isEmailValid && isLogoValid;

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleFileUpload = (file) => {
    if (!file) return;

    const isTypeAllowed =
      ALLOWED_IMAGE_TYPES.includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);

    if (!isTypeAllowed) {
      setError('Invalid format: Only JPG and PNG images are accepted.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be below 5 MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    setLogo({ file, url });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Please fill in all required fields and upload your company logo.');
      return;
    }

    // Required by user prompt: simply console log (Company, contact, country, email, logo file object for now)
    console.log('Company:', formData.company.trim());
    console.log('Contact:', formData.contact.trim());
    console.log('Country:', formData.country);
    console.log('Email:', formData.email.trim());
    console.log('Logo file object:', logo.file);

    setSuccess(true);
    setError('');
  };

  const handleReplayIntro = () => {
    setIsIntroPlaying(true);
    setTimeout(() => {
      setIsIntroPlaying(false);
    }, 1200);
  };

  return (
    <div className="cyber-app">
      {/* 3D Cyber Chamber Lighting Beams (Matching Image 2!) */}
      <div className="chamber-beams">
        <div className="beam-top" />
        <div className="beam-bottom" />
        <div className="beam-pillar-l" />
        <div className="beam-pillar-r" />
      </div>

      {/* Cyber Floor Grid & Ambient Cyan Glow */}
      <div className="cyber-floor-grid" />
      <div className="cyber-chamber-glow" />

      <div className="cyber-scene">
        {/* Top Chamber Header & Status Bar */}
        <header className="chamber-control-bar">
          <div className="chamber-status-tag">
            <span className="status-dot-pulse" />
            <span>CYBER HOLOGRAPHIC CHAMBER // SYSTEM READY</span>
          </div>

          <div className="chamber-actions">
            {isIntroPlaying ? (
              <button
                type="button"
                className="replay-intro-btn"
                onClick={() => setIsIntroPlaying(false)}
              >
                Skip 3D Intro &rarr;
              </button>
            ) : (
              <button
                type="button"
                className="replay-intro-btn"
                onClick={handleReplayIntro}
                title="Watch the 3D panel intro sequence again"
              >
                <RotateCcw size={13} /> Replay 3D Intro
              </button>
            )}

            <Link to="/" className="replay-intro-btn">
              All Companies Table
            </Link>
          </div>
        </header>

        {/* 3D Hologram Stage */}
        <div className="hologram-stage">
          {/* Background Holographic Card Left (Image 1 Style) */}
          <div
            className="bg-hologram-card left-card"
            style={{
              opacity: isIntroPlaying ? 0.3 : 0.85,
              transform: isIntroPlaying
                ? 'translateZ(-140px) translateX(-60px) rotateY(35deg)'
                : 'translateZ(-60px) rotateY(16deg)',
              transition: 'transform 0.8s ease, opacity 0.8s ease',
            }}
          >
            <div className="bg-card-header">
              <span>COMPANY PROTOCOL</span>
              <span className="bg-badge">ENCRYPTED</span>
            </div>
            <div className="bg-card-lines">
              <div className="bg-line" />
              <div className="bg-line med" />
              <div className="bg-line short" />
              <div className="bg-line" />
              <div className="bg-line med" />
            </div>
            <div className="bg-signature">Nexus Enterprise Registry &bull; 2026</div>
          </div>

          {/* Background Holographic Card Right (Image 1 Style) */}
          <div
            className="bg-hologram-card right-card"
            style={{
              opacity: isIntroPlaying ? 0.3 : 0.85,
              transform: isIntroPlaying
                ? 'translateZ(-140px) translateX(60px) rotateY(-35deg)'
                : 'translateZ(-60px) rotateY(-16deg)',
              transition: 'transform 0.8s ease, opacity 0.8s ease',
            }}
          >
            <div className="bg-card-header">
              <span>DIRECTORY METRICS</span>
              <span className="bg-badge">STATUS: ACTIVE</span>
            </div>
            <div className="bg-card-lines">
              <div className="bg-line" />
              <div className="bg-line short" />
              <div className="bg-line med" />
              <div className="bg-line" />
            </div>
            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end' }}>
              <span className="bg-badge" style={{ borderColor: '#00f0ff', color: '#00f0ff' }}>
                VERIFIED
              </span>
            </div>
          </div>

          {/* The Main Interactive Add Company Form Card */}
          <motion.div
            className="digital-form-card"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Form Top Heading */}
            <div className="df-header">
              <div className="df-title-wrap">
                <h2>
                  <Building2 size={22} color="#00f0ff" /> Add Company
                </h2>
                <div className="df-id-tag">COMPANY REGISTRATION // DIRECTORY ONBOARDING</div>
              </div>
              <span className="df-status-pill">
                {success ? 'SUBMITTED' : 'DATA SUBMISSION'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {!success ? (
                <form key="add-company-form" onSubmit={handleSubmit}>
                  <div className="df-grid">
                    {/* Field 1: Company */}
                    <CyberField icon={Building2} label="Company" id={companyId}>
                      <input
                        id={companyId}
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Corporation"
                        required
                        autoComplete="organization"
                      />
                    </CyberField>

                    {/* Field 2: Contact */}
                    <CyberField icon={UserRound} label="Contact" id={contactId}>
                      <input
                        id={contactId}
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="e.g. Sarah Connor"
                        required
                        autoComplete="name"
                      />
                    </CyberField>

                    {/* Field 3: Country */}
                    <CyberField icon={Globe2} label="Country" id={countryId}>
                      <select
                        id={countryId}
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select country</option>
                        {countries.map(([code, name]) => (
                          <option key={code} value={code}>
                            {code} &mdash; {name}
                          </option>
                        ))}
                      </select>
                    </CyberField>

                    {/* Field 4: Email */}
                    <CyberField icon={Mail} label="Email" id={emailId}>
                      <input
                        id={emailId}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. contact@acme.com"
                        required
                        autoComplete="email"
                      />
                    </CyberField>
                  </div>

                  {/* Field 5: Logo Upload (JPG/PNG <= 5MB) */}
                  <div className="df-upload-portal">
                    <div className="df-upload-label">
                      <span>
                        Logo <b>*</b>
                      </span>
                      <span>JPG / PNG &bull; MAX 5 MB</span>
                    </div>

                    <div
                      className="df-upload-box"
                      role="button"
                      tabIndex={0}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          fileInputRef.current?.click();
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files?.[0]) {
                          handleFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept="image/jpeg,image/png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />

                      {logo ? (
                        <div className="df-logo-preview">
                          <img src={logo.url} alt="Logo preview" />
                          <div className="df-logo-info">
                            <strong>{logo.file.name}</strong>
                            <span>Logo uploaded successfully</span>
                          </div>
                          <button
                            type="button"
                            className="df-remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              URL.revokeObjectURL(logo.url);
                              setLogo(null);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="df-upload-icon">
                            <Upload size={20} />
                          </div>
                          <strong>Drop company logo here</strong>
                          <span>or click to browse local JPG / PNG files</span>
                        </>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div style={{ color: '#f87171', fontSize: '11px', marginTop: '10px' }}>
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="df-actions">
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`df-submit-btn ${isFormValid ? 'ready' : ''}`}
                    >
                      <span>Add Company</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  key="success-screen"
                  className="df-success-panel"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="df-success-badge">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3>Company Added Successfully</h3>
                  <p>
                    <strong>{formData.company}</strong> ({formData.country}) has been recorded and
                    logged to the console.
                  </p>
                  <div className="df-success-actions">
                    <button
                      type="button"
                      className="df-btn-primary"
                      onClick={() => {
                        setSuccess(false);
                        setFormData(initialFormData);
                        setLogo(null);
                      }}
                    >
                      Add Another Company
                    </button>
                    <button
                      type="button"
                      className="df-btn-secondary"
                      onClick={() => navigate('/')}
                    >
                      View Companies Table
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(0, 240, 255, 0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '9px',
                color: '#7dd3fc',
                letterSpacing: '0.8px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={13} color="#00f0ff" /> 256-BIT SECURE REGISTRATION
              </span>
              <span>POWERED BY NEXUS DIRECTORY</span>
            </div>
          </motion.div>

          {/* The Glass Pedestal Base */}
          <div className="glass-pedestal">
            <div
              className="pedestal-dock-item"
              title="Upload Logo"
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
            </div>
            <div className="pedestal-dock-item" title="Search Protocol">
              <Search size={16} />
            </div>
            <div className="pedestal-dock-item" title="Settings">
              <Settings size={16} />
            </div>
            <div className="pedestal-dock-item" title="Security Verified">
              <Lock size={16} />
            </div>
            <div className="pedestal-dock-item" title="User Authorized">
              <UserRound size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
