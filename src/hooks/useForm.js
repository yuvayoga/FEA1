import { useState, useMemo, useCallback } from 'react';

const runValidation = (field, value, allValues) => {
  const rules = Array.isArray(field.validations)
    ? field.validations
    : field.validations
    ? [field.validations]
    : [];

  for (const rule of rules) {
    if (typeof rule === 'function') {
      const result = rule(value, allValues);
      if (typeof result === 'string' && result.trim().length > 0) {
        return result;
      }
      if (result === false) {
        return `${field.id} is invalid`;
      }
    } else if (rule && typeof rule === 'object') {
      if (rule.required) {
        const isEmpty =
          value === null ||
          value === undefined ||
          (typeof value === 'string' && value.trim().length === 0) ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          return rule.message || `${field.id} is required`;
        }
      }
      if (rule.pattern && value) {
        if (!rule.pattern.test(String(value))) {
          return rule.message || `${field.id} format is invalid`;
        }
      }
      if (typeof rule.validate === 'function') {
        const result = rule.validate(value, allValues);
        if (typeof result === 'string' && result.trim().length > 0) {
          return result;
        }
        if (result === false) {
          return rule.message || `${field.id} is invalid`;
        }
      }
    }
  }
  return '';
};

export default function useForm(formStructure, initialValuesOverride = null) {
  const fields = useMemo(() => {
    if (Array.isArray(formStructure)) {
      return formStructure;
    }
    if (formStructure && typeof formStructure === 'object') {
      return Object.entries(formStructure).map(([id, config]) => ({
        id,
        ...config,
      }));
    }
    return [];
  }, [formStructure]);

  const getInitialValues = useCallback(() => {
    const initial = {};
    for (const field of fields) {
      initial[field.id] =
        initialValuesOverride?.[field.id] ??
        field.initialValue ??
        (field.default ?? '');
    }
    return initial;
  }, [fields, initialValuesOverride]);

  const [values, setValues] = useState(getInitialValues);
  const [touched, setTouched] = useState({});

  const valuesSetter = useCallback((arg1, arg2) => {
    if (typeof arg1 === 'string') {
      setValues((prev) => ({ ...prev, [arg1]: arg2 }));
      setTouched((prev) => ({ ...prev, [arg1]: true }));
    } else if (arg1 && arg1.target) {
      const { name, id, value, files, type } = arg1.target;
      const key = name || id;
      if (key) {
        const val = type === 'file' ? files?.[0] : value;
        setValues((prev) => ({ ...prev, [key]: val }));
        setTouched((prev) => ({ ...prev, [key]: true }));
      }
    } else if (typeof arg1 === 'function') {
      setValues(arg1);
    } else if (arg1 && typeof arg1 === 'object') {
      setValues((prev) => ({ ...prev, ...arg1 }));
    }
  }, []);

  const errors = useMemo(() => {
    const nextErrors = {};
    for (const field of fields) {
      nextErrors[field.id] = runValidation(field, values[field.id], values);
    }
    return nextErrors;
  }, [fields, values]);

  const isValid = useMemo(() => {
    return fields.every((field) => !errors[field.id]);
  }, [fields, errors]);

  const resetForm = useCallback(
    (nextValues = null) => {
      setValues(nextValues || getInitialValues());
      setTouched({});
    },
    [getInitialValues]
  );

  const handleBlur = useCallback((fieldIdOrEvent) => {
    if (typeof fieldIdOrEvent === 'string') {
      setTouched((prev) => ({ ...prev, [fieldIdOrEvent]: true }));
    } else if (fieldIdOrEvent?.target) {
      const key = fieldIdOrEvent.target.name || fieldIdOrEvent.target.id;
      if (key) {
        setTouched((prev) => ({ ...prev, [key]: true }));
      }
    }
  }, []);

  return {
    values,
    valuesSetter,
    errors,
    isValid,
    isFormValid: isValid,
    touched,
    handleBlur,
    resetForm,
    setValues: valuesSetter,
  };
}

