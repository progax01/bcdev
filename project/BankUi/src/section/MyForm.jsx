import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContractConnect from "./ContractConnect";

const MyForm = () => {
  const [transHash, settransHash] = useState("null");
  const [loading, setLoading] = useState(false);

  // Validation for Aadhar
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];
  const aadharNumberValidation = Yup.string()
    .matches(/^\d{12}$/, "Aadhar number must be 12 digit only")
    .test("aadhar-number", "Invalid Aadhar number", (value) => {
      if (!value) return true; // Let Yup handle required validation if needed

      // Remove spaces and dashes from the Aadhar number
      const aadharNumber = value.replace(/[\s-]+/g, "");

      let c = 0;
      const invertedArray = aadharNumber.split("").map(Number).reverse();

      invertedArray.forEach((val, i) => {
        c = d[c][p[i % 8][val]];
      });

      return c === 0;
    });

  //Validation for full name

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Full Name is required")
      .test("is-valid-fullname", "Invalid Full Name", (value) => {
        if (!/^[A-Z]/.test(value)) {
          throw new Yup.ValidationError(
            "First letter should be capitalized",
            null,
            "fullName"
          );
        }

        if (/\d/.test(value)) {
          throw new Yup.ValidationError(
            "Full Name cannot contain digits",
            null,
            "fullName"
          );
        }
        if (value.length < 6) {
          throw new Yup.ValidationError(
            "Full Name length should be at least 6 characters",
            null,
            "fullName"
          );
        }
        return true;
      }),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .required("Phone Number is required"),
    aadharNumber: aadharNumberValidation,
    location: Yup.string().required("Full Name is required"),
  });

  const initialValues = {
    fullName: "",
    email: "",
    phoneNumber: "",
    aadharNumber: "",
    location: "",
  };

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    let processToastId;
    try {
      // Validate the form data
      await validationSchema.validate(values, { abortEarly: false });

      // Send form data to the smart contract
      processToastId = toast.info("Transaction in Process...", {
        position: "top-right",
        autoClose: false, // Don't auto-close until you have the transaction hash
      });
      setLoading(true);

      const transactionHash = await ContractConnect(values);
      toast.dismiss(processToastId);
      // Display a success message using toast with the transaction hash
      toast.success(
        `Transaction successful. Transaction hash: ${transactionHash}`,
        { position: "top-right", autoClose: 8000 }
      );
      settransHash(transactionHash);

      // formik.resetForm();
    } catch (error) {
      // Handle validation errors and contract interaction errors
      if (error.name === "ValidationError") {
        // Handle validation errors and display them using formik
        toast.dismiss(processToastId);
        error.inner.forEach((err) => {
          Formik.setFieldError(err.path, err.message);
        });
      } else if (error.message.includes("Address used")) {
        toast.error("KYC with this account already done use different", {
          position: "top-right",
          autoClose: 8000,
        });
      } else {
        console.error("Error:", error);
        toast.error("Error submitting the form", { position: "top-right" });
      }
    }
  };
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">KYC Form</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="w-[20rem]">
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-gray-600 font-medium mb-1"
            >
              Full Name:
            </label>
            <Field
              type="text"
              name="fullName"
              className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:border-yellow-500"
            />
            <ErrorMessage
              name="fullName"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-1"
            >
              Email:
            </label>
            <Field
              type="text"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:border-yellow-500"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-gray-600 font-medium mb-1"
            >
              Phone Number:
            </label>
            <Field
              type="text"
              name="phoneNumber"
              className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:border-yellow-500"
            />
            <ErrorMessage
              name="phoneNumber"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="aadhar"
              className="block text-gray-600 font-medium mb-1"
            >
              Aadhar Number:
            </label>
            <Field
              type="number"
              name="aadharNumber"
              className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:border-yellow-500"
            />
            <ErrorMessage
              name="aadharNumber"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-gray-600 font-medium mb-1"
            >
              Full Address:
            </label>
            <Field
              type="text"
              name="location"
              className="w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:border-yellow-500"
            />
            <ErrorMessage
              name="location"
              component="div"
              className="text-red-500 mt-1"
            />
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
