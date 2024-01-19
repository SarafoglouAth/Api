
import axios from "axios";


export const GetId = async (Username) => {
    try {
        const response = await axios.get(
            "https://localhost:7060/Users/GetIdFromUsername?username=" + Username
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

