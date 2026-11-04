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
import useForm from '../hooks/useForm';
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

const formStructure = [
  {
    id: 'company',
    initialValue: '',
    validations: [
      (val) => (!val || !val.trim() ? 'Company name is required' : ''),
    ],
  },
  {
    id: 'contact',
    initialValue: '',
    validations: [
      (val) => (!val || !val.trim() ? 'Contact name is required' : ''),
    ],
  },
  {
    id: 'country',
    initialValue: '',
    validations: [
      (val) => {
        if (!val) return 'Country selection is required';
        if (!VALID_COUNTRY_CODES.has(val)) return 'Please select a valid country';
        return '';
      },
    ],
  },
  {
    id: 'email',
    initialValue: '',
    validations: [
      (val) => {
        if (!val || !val.trim()) return 'Email is required';
        if (!EMAIL_REGEX.test(val.trim())) return 'Please enter a valid email address';
        return '';
      },
    ],
  },
  {
    id: 'logo',
    initialValue: null,
    validations: [
      (val) => {
        if (!val || !val.file) {
          return 'Company logo is required';
        }
        const file = val.file;
        const isTypeAllowed =
          ALLOWED_IMAGE_TYPES.includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);
        if (!isTypeAllowed) {
          return 'Invalid format: Only JPG and PNG images are accepted';
        }
        if (file.size > 5 * 1024 * 1024) {
          return 'File size must be below 5 MB';
        }
        return '';
      },
    ],
  },
];

function CyberField({ icon: Icon, label, id, error, touched, children }) {
  return (
    <div className="df-field">
      <label htmlFor={id}>
        {label} <b>*</b>
      </label>
      <div className="df-input-shell">
        <Icon size={16} />
        {children}
      </div>
      {touched && error && (
        <span style={{ color: '#f87171', fontSize: '11px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}

CyberField.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default function AddCompanyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const companyId = useId();
  const contactId = useId();
  const countryId = useId();
  const emailId = useId();

  const { values, valuesSetter, errors, isValid, touched, handleBlur, resetForm } =
    useForm(formStructure);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroPlaying(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
    valuesSetter('logo', { file, url });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      setError('Please fill in all required fields and upload your company logo.');
      return;
    }

    console.log('Company:', values.company.trim());
    console.log('Contact:', values.contact.trim());
    console.log('Country:', values.country);
    console.log('Email:', values.email.trim());
    console.log('Logo file object:', values.logo.file);

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
      <div className="chamber-beams">
        <div className="beam-top" />
        <div className="beam-bottom" />
        <div className="beam-pillar-l" />
        <div className="beam-pillar-r" />
      </div>

      <div className="cyber-floor-grid" />
      <div className="cyber-chamber-glow" />

      <div className="cyber-scene">
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

        <div className="hologram-stage">
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

          <motion.div
            className="digital-form-card"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
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
                    <CyberField
                      icon={Building2}
                      label="Company"
                      id={companyId}
                      error={errors.company}
                      touched={submitted || touched.company}
                    >
                      <input
                        id={companyId}
                        name="company"
                        value={values.company}
                        onChange={valuesSetter}
                        onBlur={handleBlur}
                        placeholder="e.g. Acme Corporation"
                        required
                        autoComplete="organization"
                      />
                    </CyberField>

                    <CyberField
                      icon={UserRound}
                      label="Contact"
                      id={contactId}
                      error={errors.contact}
                      touched={submitted || touched.contact}
                    >
                      <input
                        id={contactId}
                        name="contact"
                        value={values.contact}
                        onChange={valuesSetter}
                        onBlur={handleBlur}
                        placeholder="e.g. Sarah Connor"
                        required
                        autoComplete="name"
                      />
                    </CyberField>

                    <CyberField
                      icon={Globe2}
                      label="Country"
                      id={countryId}
                      error={errors.country}
                      touched={submitted || touched.country}
                    >
                      <select
                        id={countryId}
                        name="country"
                        value={values.country}
                        onChange={valuesSetter}
                        onBlur={handleBlur}
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

                    <CyberField
                      icon={Mail}
                      label="Email"
                      id={emailId}
                      error={errors.email}
                      touched={submitted || touched.email}
                    >
                      <input
                        id={emailId}
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={valuesSetter}
                        onBlur={handleBlur}
                        placeholder="e.g. contact@acme.com"
                        required
                        autoComplete="email"
                      />
                    </CyberField>
                  </div>

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

                      {values.logo ? (
                        <div className="df-logo-preview">
                          <img src={values.logo.url} alt="Logo preview" />
                          <div className="df-logo-info">
                            <strong>{values.logo.file.name}</strong>
                            <span>Logo uploaded successfully</span>
                          </div>
                          <button
                            type="button"
                            className="df-remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (values.logo?.url) {
                                URL.revokeObjectURL(values.logo.url);
                              }
                              valuesSetter('logo', null);
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

                    {(submitted || touched.logo) && errors.logo && (
                      <div style={{ color: '#f87171', fontSize: '11px', marginTop: '6px' }}>
                        {errors.logo}
                      </div>
                    )}
                  </div>

                  {error && (
                    <div style={{ color: '#f87171', fontSize: '11px', marginTop: '10px' }}>
                      {error}
                    </div>
                  )}

                  <div className="df-actions">
                    <button
                      type="submit"
                      disabled={!isValid}
                      className={`df-submit-btn ${isValid ? 'ready' : ''}`}
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
                    <strong>{values.company}</strong> ({values.country}) has been recorded and
                    logged to the console.
                  </p>
                  <div className="df-success-actions">
                    <button
                      type="button"
                      className="df-btn-primary"
                      onClick={() => {
                        setSuccess(false);
                        setSubmitted(false);
                        if (values.logo?.url) {
                          URL.revokeObjectURL(values.logo.url);
                        }
                        resetForm();
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
