import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    onClick?: () => void;
}

export default function ListItemBox({ children, onClick }: Props) {
    const handleOnchange = () => {
        if (onClick == null) return;
        onClick();
    };

    return (
        <li
            className="flex justify-between w-full py-2 px-4 list-none cursor-pointer select-none"
            onClick={handleOnchange}
        >
            {children}
        </li>
    );
}
