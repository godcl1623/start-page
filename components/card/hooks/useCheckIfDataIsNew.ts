import { checkIfTodayLessThan } from 'common/helpers';
import { useEffect, useState } from 'react';

const useCheckIfDataIsNew = (dateString: string | null) => {
    const [dateState, setDateState] = useState(false);

    useEffect(() => {
        if (dateString != null) {
            const dateFlag = checkIfTodayLessThan(dateString);
            dateFlag && setDateState(dateFlag);
        }
    }, [dateString]);

    return dateState;
};

export default useCheckIfDataIsNew;
