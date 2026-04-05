/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ZodSchema } from "zod";

type Errors<T> = Partial<Record<keyof T, string>>;

export function useFormValidation<T extends Record<string, any>>(
  schema: ZodSchema<T>,
  initialValues: T,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  /** Update field value */
  const handleChange = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));

    // Clear error while typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  /** Mark field as touched */
  const handleBlur = <K extends keyof T>(key: K) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  /** Validate entire form */
  const validate = () => {
    const result = schema.safeParse(values);

    if (!result.success) {
      const fieldErrors: Errors<T> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof T;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });

      setErrors(fieldErrors);

      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>,
      );

      setTouched(allTouched);

      return false;
    }

    setErrors({});
    return true;
  };

  /** Get error only if field has value & was touched */
  const getError = <K extends keyof T>(key: K) => {
    if (!touched[key]) return undefined;
    return errors[key];
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    getError,
    setValues,
    setErrors,
  };
}
