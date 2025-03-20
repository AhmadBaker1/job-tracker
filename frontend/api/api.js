const API_URL = 'http://localhost:5000'; // URL of the API

export const fetchServerStatus = async () => {
    try {
        const response = await fetch(`${API_URL}/`); // Fetch the response from the API

        // Reading the response
        const data = await response.text(); // Read the response as text

        return data; // Return the response data

    } catch (error) {
            // If there's an error, log it and return an error message
            console.error('Error fetching server status:', error); // Log an error if one occurs
            return "Error connecting to server: ";
        }
    }