import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const MyForm = () => {
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone Number is required'),
  });

  const initialValues = {
    fullName: '',
    email: '',
    phoneNumber: '',
  };

  const handleSubmit = (values) => {
    setTimeout(() => {
      toast.success('KYC form submitted successfully!', { position: 'top-right' });
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">KYC Form</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-600 font-medium mb-1">
              Full Name:
            </label>
            <Field
              type="text"
              name="fullName"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
            <ErrorMessage name="fullName" component="div" className="text-red-500 mt-1" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-medium mb-1">
              Email:
            </label>
            <Field
              type="text"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 mt-1" />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-600 font-medium mb-1">
              Phone Number:
            </label>
            <Field
              type="text"
              name="phoneNumber"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
            <ErrorMessage name="phoneNumber" component="div" className="text-red-500 mt-1" />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default MyForm;
