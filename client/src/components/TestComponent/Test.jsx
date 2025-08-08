import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TestView from "./TestView";
import TestForm from "./TestForm";
import TestOtp from "./TestOtp";


const Test = () => {
    const { test_id } = useParams();
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/test/${test_id}`);
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

    if (testData.status === '2' || testData.status === 'expired') {
        return <div>Link has been expired. Please contact support.</div>;
    }

    if (testData.status === '3' || testData.status === 'completed') {
        const percentage = testData.total_percentage || 0;
        return <TestView test={testData.test} percentage={percentage} />;
    }

    // if (testData.has_otp) {
    //     return <TestOtp testId={test_id} />;
    // }
    if ((testData.has_otp || (testData.test?.type === 1)) && !testData.test?.otp_verified) {
        return <TestOtp testId={test_id} />;
    }

    return <TestForm test={testData.test} testId={test_id} />;
};

export default Test;
