import { useEffect, useState } from 'react';

const useHandleInputFill = (inputValue: string): boolean => {
    const [isInputFilled, setIsInputFilled] = useState<boolean>(false);

    useEffect(() => {
        if (inputValue.length > 0) setIsInputFilled(true);
        else setIsInputFilled(false);
    }, [inputValue]);

    return isInputFilled;
};

export default useHandleInputFill;
