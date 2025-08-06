import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import TestOtp from './TestOtp';
import TestView from './TestView';
import TestForm from './TestForm';

const TestComponent = ({ testId }) => {
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/test/${testId}`);
                setTestData(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load test');
            } finally {
                setLoading(false);
            }
        };

        fetchTestData();
    }, [testId]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    if (testData.status === 'expired') {
        return <div className="expired-message">{testData.message}</div>;
    }

    if (testData.status === 'completed') {
        return <TestView test={testData.test} percentage={testData.total_percentage} />;
    }

    if (testData.has_otp) {
        return <TestOtp testId={testId} />;
    }

    return <TestForm test={testData.test} testId={testId} />;
};

export default TestComponent;