import { FilterType } from "hooks/useFilters";
import ListItemBox from "../common/ListItemBox";

interface Props {
    alternativeString: string;
    visibleState: FilterType<boolean>;
    origins: string;
    changeDisplayFlag: (target: string, value: boolean) => () => void;
}

export default function SubscriptionOption({
    alternativeString,
    visibleState,
    origins,
    changeDisplayFlag,
}: Readonly<Props>) {
    return (
        <ListItemBox
            onClick={changeDisplayFlag(origins, !visibleState[origins])}
        >
            <div>{origins || alternativeString}</div>
            <label
                htmlFor={`checkDisplay_${origins ?? alternativeString}`}
                className="w-5 h-5 border border-neutral-500 rounded p-0.5 cursor-pointer dark:border-gray-300"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    changeDisplayFlag(origins, !visibleState[origins])();
                }}
            >
                <div
                    className={`w-full h-full rounded-sm ${
                        visibleState[origins]
                            ? "bg-neutral-500 dark:bg-neutral-200"
                            : "bg-transparent"
                    }`}
                />
            </label>
            <input
                type="checkbox"
                id={`checkDisplay_${origins ?? alternativeString}`}
                className="hidden"
                value={origins}
                checked={visibleState[origins] ?? true}
                onChange={() => null}
            />
        </ListItemBox>
    );
}
