import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function ListItemBox({ children }: Props) {
    return (
        <li className="flex justify-between w-full py-2 px-4 list-none cursor-pointer select-none">
            {children}
        </li>
    );
}
