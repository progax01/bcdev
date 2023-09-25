import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContractConnect from "./ContractConnect";
import Layout from "../component/Layout";
// import uploadImage from "../component/PinataFile";
// import { uploadImageToIPFS } from "./IPFSUtils";

const MyForm = () => {
  const [transHash, settransHash] = useState("null");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError]= useState(null);
  const [imgcid, setimgcid]= useState(null);

// const handleImageUpload =  (e) => {
//   const file = e.target.files[0];

//   try {
//     if (!file) {
//       // Provide a more informative error message for empty file uploads
//       toast.error("Please select a valid image file.", { position: "top-right" });
//        // Return early to prevent further execution
//     }

//     // Call the uploadImage function with the selected file
//     const uploadResult =  uploadImage(file);
//     setimgcid(uploadResult);
//     if (uploadResult) {
//       console.log(uploadResult);
//       setError("");
//     } else {
//       // Handle upload failure, possibly with an error message from uploadResult
//       setError(uploadResult.error || "Error in uploading file.");
//     }
//   } catch (error) {
//     console.error(error);

//     // Handle unexpected errors
//     toast.error("An error occurred. Please try again later.", {
//       position: "top-right",
//     });
//   }
// };
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
    .required("Aadhar is required")
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
      email: Yup.string()
      .required("Email cannot be empty")
      .test("whitespace", "Cannot contain whitespace.", (value) => !/\s/.test(value))
      .test("hyphens-underscores", "Cannot contain more than 2 hyphens or underscores.", (value) => {
        const hyphensCount = (value.match(/-/g) || []).length;
        const underscoresCount = (value.match(/_/g) || []).length;
        return hyphensCount <= 2 && underscoresCount <= 2;
      })
      .test("special-characters", "Special characters not allowed.", (value) => !/[+=`{},!?;:'"#%^&*()<>|/\\]/.test(value))
      .test("email-format", "Invalid email format", (value) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)),
      phoneNumber: Yup.string()
      .required("Phone number cannot be empty")
      .matches(/^[6789]/, "Enter Indian No. starts 6, 7, 8, 9")
      .test("no-special-chars", "Special characters not allowed", (value) => !/[-+=`{},.!?;:'"@#$%^&*()<>|\/]/.test(value))
      .test("no-whitespace", "Remove whitespace", (value) => !/\s+/.test(value))
      .test("no-alphabets", "Characters cannot be used", (value) => !/[a-zA-Z]/.test(value))
      .matches(/^\d{10}$/, "Exactly 10 digits allowed"),
    aadharNumber: aadharNumberValidation,
    location: Yup.string().required("Full address required").min(9, "Address too short enter full address"),
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
    // const imageCID = imgcid;
    // console.log(imageCID);

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
    <Layout>
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none  focus:border-blue-500"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none  focus:border-blue-500"
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
              type="tel"
              name="phoneNumber"
              className="w-full px-4 py-2 border rounded-md focus:outline-none  focus:border-blue-500"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none  focus:border-blue-500"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none  focus:border-blue-500"
            />
            <ErrorMessage
              name="location"
              component="div"
              className="text-red-500 mt-1"
            />
          </div>
{/*
          <div>
                <label htmlFor="image">Upload Image:</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                  
                />
                   {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
  */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-800  py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
      </Layout>
  );
};

export default MyForm;
