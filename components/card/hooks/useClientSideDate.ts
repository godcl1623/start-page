import { useEffect, useState } from 'react';

const useClientSideDate = (dateFromRemote: string | null) => {
    const [clientSideDate, setClientSideDate] = useState<string>('');

    useEffect(() => {
        if (typeof window !== 'undefined' && dateFromRemote != null) {
            const parsedDate = new Date(dateFromRemote).toDateString();
            setClientSideDate(parsedDate);
        }
    }, [dateFromRemote]);

    return clientSideDate;
};

export default useClientSideDate;
