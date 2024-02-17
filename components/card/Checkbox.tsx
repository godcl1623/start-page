import { MouseEvent, useState } from "react";

import { IconType } from "react-icons";

interface CheckboxProps {
    targetState: boolean;
    feedId: string;
    buttonIcon: IconType;
    handleCheckbox: (event: MouseEvent<HTMLLabelElement>) => void;
}

export default function Checkbox({
    targetState,
    feedId,
    buttonIcon,
    handleCheckbox,
}: Readonly<CheckboxProps>) {
    const ButtonIcon = buttonIcon;
    const [checkedState, setCheckedState] = useState<boolean>(false);

    const handleChange = () => {
        setCheckedState(targetState);
    };

    return (
        <label
            htmlFor={`checkbox_${buttonIcon.name}_${feedId}`}
            onClick={handleCheckbox}
        >
            <input
                id={`checkbox_${buttonIcon.name}_${feedId}`}
                type="checkbox"
                className="hidden"
                checked={checkedState}
                onChange={handleChange}
            />
            <ButtonIcon
                className={`text-xl cursor-pointer ${
                    targetState ? "fill-yellow-300" : "fill-gray-200"
                }`}
            />
        </label>
    );
}
