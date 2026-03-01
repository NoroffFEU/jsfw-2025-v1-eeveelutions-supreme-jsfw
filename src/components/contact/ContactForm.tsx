import { useState } from 'react';
import type { ContactFormData, ContactFormErrors } from '../../types/contact';

export function ContactForm({ onSubmit }: { onSubmit: (data: ContactFormData) => void }) {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    subject: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        fullName: '',
        subject: '',
        email: '',
        message: '',
      });
      setErrors({});
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClass = (fieldError?: string) =>
    `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${fieldError
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-blue-500'
    }`;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-6">
        <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={inputClass(errors.fullName)}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={inputClass(errors.subject)}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={inputClass(errors.email)}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`${inputClass(errors.message)} resize-none`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 hover:cursor-pointer transition-colors"
      >
        Submit
      </button>
    </form>
  );
}
