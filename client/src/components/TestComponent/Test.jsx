import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TestView from './TestView';
import TestForm from './TestForm';
import TestOtp from './TestOtp';

const Test = () => {
    const { test_id } = useParams();
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/test/${test_id}`);
                console.log(response,'responseresponseresponse');
                setTestData(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load test');
            } finally {
                setLoading(false);
            }
        };

        fetchTestData();
    }, [test_id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    if (testData.status === '2') {
        console.log('1');
        return <div>Link has been expired. Please contact support.</div>;
    }

    if (testData.status === '3') {
           console.log('12');
        return <TestView test={testData.test} />;
    }

    if (testData.has_otp) {
           console.log('13');
        return <TestOtp testId={test_id} />;
    }
           console.log(testData.test);
    return <TestForm test={testData.test} testId={test_id} />;
};

export default Test;