import { useRef, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Building2, UserRound, Globe2, Mail } from 'lucide-react';
import useForm from '../hooks/useForm';
import { countries } from '../constants/countries';

const formStructure = [
  { id: 'company', initialValue: '' },
  { id: 'contact', initialValue: '' },
  { id: 'country', initialValue: '' },
  { id: 'email', initialValue: '' },
  { id: 'logo', initialValue: null },
];

export default function CompanySlider({ isOpen, onClose, row }) {
  const fileInputRef = useRef(null);

  const initialValues = useMemo(() => {
    return {
      company: row?.company || '',
      contact: row?.contact || '',
      country: row?.country || '',
      email: row?.email || '',
      logo: row?.logo
        ? typeof row.logo === 'object'
          ? row.logo
          : { url: row.logo, name: String(row.logo).split('/').pop() || 'logo.png' }
        : null,
    };
  }, [row]);

  const { values, valuesSetter, handleBlur, resetForm } = useForm(
    formStructure,
    initialValues
  );

  useEffect(() => {
    resetForm(initialValues);
  }, [initialValues, resetForm]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleFileUpload = useCallback(
    (file) => {
      if (!file) return;
      const url = URL.createObjectURL(file);
      valuesSetter('logo', { file, url, name: file.name });
    },
    [valuesSetter]
  );

  const handleRemoveLogo = useCallback(() => {
    if (values.logo?.url && values.logo?.file) {
      URL.revokeObjectURL(values.logo.url);
    }
    valuesSetter('logo', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [values.logo, valuesSetter]);

  const handleSubmit = useCallback(
    (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      console.log('Company:', values.company);
      console.log('Contact:', values.contact);
      console.log('Country:', values.country);
      console.log('Email:', values.email);
      console.log('Logo:', values.logo);
      console.log('Field values:', values);
      console.log(values);
    },
    [values]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="relative z-10 w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Edit Company"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Edit Company</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form id="edit-company-slider-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="slider-company" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span>Company</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="slider-company"
                    name="company"
                    type="text"
                    value={values.company}
                    onChange={valuesSetter}
                    onBlur={handleBlur}
                    placeholder="e.g. Acme Corporation"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-800 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="slider-contact" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1">
                    <UserRound className="h-4 w-4 text-gray-500" />
                    <span>Contact</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="slider-contact"
                    name="contact"
                    type="text"
                    value={values.contact}
                    onChange={valuesSetter}
                    onBlur={handleBlur}
                    placeholder="e.g. Sarah Connor"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-800 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="slider-country" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1">
                    <Globe2 className="h-4 w-4 text-gray-500" />
                    <span>Country</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="slider-country"
                    name="country"
                    value={values.country}
                    onChange={valuesSetter}
                    onBlur={handleBlur}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-800 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select country</option>
                    {countries.map(([code, name]) => (
                      <option key={code} value={code}>
                        {code} &mdash; {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="slider-email" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>Email</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="slider-email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={valuesSetter}
                    onBlur={handleBlur}
                    placeholder="e.g. contact@acme.com"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-800 shadow-xs transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Upload className="h-4 w-4 text-gray-500" />
                      <span>Logo</span>
                    </span>
                    <span className="text-xs text-gray-400 font-normal">JPG / PNG (max 5MB)</span>
                  </label>

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
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <img
                        src={typeof values.logo === 'string' ? values.logo : values.logo.url}
                        alt="Logo preview"
                        className="h-12 w-12 object-contain rounded-md border border-gray-300 bg-white p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {values.logo.file?.name || values.logo.name || 'Company logo'}
                        </p>
                        <p className="text-[11px] text-green-600 font-medium">Logo attached</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div
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
                      className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg p-5 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-blue-50/50"
                    >
                      <Upload className="mx-auto h-7 w-7 text-gray-400 mb-1" />
                      <p className="text-xs font-semibold text-gray-700">Click to upload or drag & drop</p>
                      <p className="text-[11px] text-gray-500">JPG or PNG up to 5 MB</p>
                    </div>
                  )}
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  form="edit-company-slider-form"
                  onClick={handleSubmit}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

CompanySlider.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  row: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    company: PropTypes.string,
    contact: PropTypes.string,
    country: PropTypes.string,
    email: PropTypes.string,
    logo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
};
