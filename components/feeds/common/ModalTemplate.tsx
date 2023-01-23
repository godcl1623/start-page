import { ReactNode } from "react";

interface Props {
    headingTitle: string | ReactNode;
    listItems: ReactNode[];
}

export default function ModalTemplate({ headingTitle, listItems }: Props) {
    return (
        <>
            <h1 className="mb-4 text-xl">{headingTitle}</h1>
            <ul className="relative flex-center flex-col w-full h-full mb-4">
                {listItems}
            </ul>
        </>
    );
}
