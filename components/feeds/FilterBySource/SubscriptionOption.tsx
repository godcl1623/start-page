import { FilterType } from "hooks/useFilters";
import ListItemBox from "../common/ListItemBox";

interface Props {
    alternativeString: string;
    displayState: FilterType<boolean>;
    origins: string;
    changeDisplayFlag: (target: string, value: boolean) => () => void;
}

export default function SubscriptionOption({
    alternativeString,
    displayState,
    origins,
    changeDisplayFlag,
}: Props) {
    return (
        <ListItemBox
            onClick={changeDisplayFlag(origins, !displayState[origins])}
        >
            <div>{origins || alternativeString}</div>
            <label
                htmlFor="checkDisplay"
                className="w-5 h-5 border rounded p-0.5 cursor-pointer"
                onClick={changeDisplayFlag(origins, !displayState[origins])}
            >
                <div
                    className={`w-full h-full ${
                        displayState[origins] ? "bg-white" : "bg-transparent"
                    }`}
                />
            </label>
            <input
                type="checkbox"
                name="checkDisplay"
                className="hidden"
                value={origins}
                checked={displayState[origins] ?? true}
                onChange={() => {}}
            />
        </ListItemBox>
    );
}
