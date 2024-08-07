import React from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../services/allApis';
import './RegistrationForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';


const validationSchema = Yup.object({
    userName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    phoneno: Yup.string()
        .required('Required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
});

const RegistrationForm: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: { userName: string; email: string; phoneno: string }) => {
        try {
            const result = await registerApi(values);
            console.log(result);

          
            if ("data" in result) {
                toast.success('Registration successful!', {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light',
                });
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('currentUser', JSON.stringify(result.data.user));
                localStorage.setItem('currentId', result.data.user._id);
                navigate('/questions');
            }
            
            if ("response" in result) {
                const err = (result.response?.data as { message?: string }).message
                console.log(err);

                toast.error(err, {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light',
                });
            }
        } catch (error) {
            toast.error('Registration failed. Please try again.', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        }
    };


    return (
        <div className="registration-container">
            <div className="registration-form">
                <h1 className='text-center text-info'>Unlock Your Potential – Enroll in the Test Now!</h1>
                <Formik
                    initialValues={{ userName: '', email: '', phoneno: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="userName">User Name:</label>
                            <Field name="userName" type="text" />
                            <ErrorMessage name="userName" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <Field name="email" type="email" />
                            <ErrorMessage name="email" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneno">Phone No:</label>
                            <Field name="phoneno" type="text" />
                            <ErrorMessage name="phoneno" component="div" className="error" />
                        </div>
                        <div className='text-center'>
                            <button className="submit-button rounded-pill" type="submit">Register</button>
                        </div>
                    </Form>
                </Formik>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default RegistrationForm;
