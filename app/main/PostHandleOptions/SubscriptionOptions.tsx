import Button from "components/common/Button";
import { ModalKeys } from "../MainView";
import { nanoid } from "nanoid";

interface Props {
    handleClick: (target: ModalKeys) => () => void;
    filterFavorites: () => void;
}

export default function SubscriptionOptions({
    handleClick,
    filterFavorites,
}: Props) {
    const buttonData = {
        "구독 추가": handleClick("addSubscription"),
        "구독 취소": handleClick("cancelSubscription"),
        즐겨찾기: filterFavorites,
        "출처별 필터": handleClick("filterBySource"),
    };
    const optionButtonsList = Object.entries(buttonData).map(
        (buttonData: [string, () => void]) => {
            const [buttonText, clickHandler] = buttonData;
            return (
                <li key={`${buttonText}_${nanoid()}`} className="w-full">
                    <Button
                        type="button"
                        customStyle="w-full bg-neutral-500 text-xs text-neutral-100 dark:bg-neutral-500 "
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
