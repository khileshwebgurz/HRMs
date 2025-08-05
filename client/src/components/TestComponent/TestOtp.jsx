import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const TestOtp = ({ testId }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value.replace(/[^0-9]/g, '');
        setOtp(newOtp);

        if (value && index < 3) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/verify-otp', {
                test_token: testId,
                otp: otp.join('')
            });

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Verified!',
                    text: response.data.message,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate(`/test/${testId}`); // Redirect to test page
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-verification">
            <h2>OTP Verification</h2>
            <p>Enter the 4-digit code sent to your email</p>
            
            <form onSubmit={handleSubmit}>
                <div className="otp-inputs">
                    {[0, 1, 2, 3].map((index) => (
                        <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            maxLength="1"
                            value={otp[index]}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            autoFocus={index === 0}
                            className="otp-input"
                        />
                    ))}
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading || otp.some(digit => !digit)}
                    className="verify-button"
                >
                    {loading ? 'Verifying...' : 'Verify'}
                </button>
            </form>
        </div>
    );
};

export default TestOtp;