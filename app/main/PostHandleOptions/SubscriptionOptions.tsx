import Button from "components/common/Button";
import { ModalKeys } from '../MainView';

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
        (buttonData: [string, () => void], index: number) => {
            const [buttonText, clickHandler] = buttonData;
            return (
                <Button
                    key={`${buttonText}_${index}`}
                    type="button"
                    clickHandler={clickHandler}
                >
                    {buttonText}
                </Button>
            );
        }
    );

    return (
        <section className="grid grid-cols-2 gap-2 w-full xs:flex xs:justify-between xs:gap-2">
            {optionButtonsList}
        </section>
    );
}
