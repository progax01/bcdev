import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';


const KYCForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number is invalid')
      .required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zip: Yup.string().required('Zip code is required'),
  });

  const onSubmit = (values) => {
    // Submit the form to the server
    setSubmitted(true);
    toast.success('KYC form submitted successfully!');
  };

  const groupedErrors = harden(errors).groupBy(({ fieldPath }) => fieldPath);

  return (
    <Formik
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      initialValues={{
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
      }}
    >
      <Form>
        <Field name="name" type="text" placeholder="Name" />
        <Field name="email" type="email" placeholder="Email" />
        <Field name="phone" type="tel" placeholder="Phone Number" />
        <Field name="address" type="text" placeholder="Address" />
        <Field name="city" type="text" placeholder="City" />
        <Field name="state" type="text" placeholder="State" />
        <Field name="zip" type="text" placeholder="Zip Code" />
        <button type="submit" disabled={submitted}>Submit</button>
      </Form>
    </Formik>
  );
};

export default KYCForm;
