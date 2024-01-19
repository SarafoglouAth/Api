import { useCallback, useState } from 'react'
import axios from 'axios'
import moment from "moment/moment";

export function useSignUp() {
    const [loading, setLoading] = useState(false)
    const formatDateWithMoment = (dateString) => {
        const originalDate = moment(dateString);
        return originalDate.format('YYYY-MM-DD');
    };
    const signUp = async (data) => {
        try {
            setLoading(true)

            data.birthDate= formatDateWithMoment(data.birthDate);
            data.photoIDIssueDate= formatDateWithMoment(data.photoIDIssueDate);

            await axios.post(`https://localhost:7060/candidates/Admin`, data, { headers: { 'Access-Control-Allow-Origin': '*' } })

            console.log(data)
        }
        catch  { }
        finally {
            setLoading(false)
        }

    }

    return { loading, signUp }
}