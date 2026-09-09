import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // You can add any cleanup logic here, like clearing authentication tokens.
        console.log("Logging out...");
        navigate('/'); // Redirect to the login page
    }, [navigate]);

    return null; // This component does not render anything
};

export default Logout;
