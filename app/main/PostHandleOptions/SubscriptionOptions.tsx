import Button from "components/common/Button";
import { ModalKeys } from "../MainView";
import { nanoid } from "nanoid";

interface Props {
    handleClick: (target: ModalKeys) => () => void;
    filterFavorites: () => void;
    isFilterFavorite: boolean;
    isFilterSources: boolean;
}

interface ButtonData {
    clickHandler: () => void;
    isFiltering?: boolean;
}

export default function SubscriptionOptions({
    handleClick,
    filterFavorites,
    isFilterFavorite,
    isFilterSources,
}: Readonly<Props>) {
    const buttonData = {
        "구독 추가": {
            clickHandler: handleClick("addSubscription"),
        },
        "구독 취소": { clickHandler: handleClick("cancelSubscription") },
        즐겨찾기: {
            clickHandler: filterFavorites,
            isFiltering: isFilterFavorite,
        },
        "출처별 필터": {
            clickHandler: handleClick("filterBySource"),
            isFiltering: isFilterSources,
        },
    };
    const optionButtonsList = Object.entries(buttonData).map(
        (buttonData: [string, ButtonData]) => {
            const [buttonText, { clickHandler, isFiltering }] = buttonData;
            return (
                <li key={`${buttonText}_${nanoid()}`} className="w-full">
                    <Button
                        type="button"
                        customStyle={`w-full bg-neutral-500 text-xs text-neutral-100 dark:bg-neutral-500 ${isFiltering ? 'brightness-75' : ''}`}
                        clickHandler={clickHandler}
                    >
                        {buttonText}
                    </Button>
                </li>
            );
        }
    );

    return (
        <menu className="grid grid-cols-2 gap-2 xs:flex xs:justify-between xs:gap-2">
            {optionButtonsList}
        </menu>
    );
}
