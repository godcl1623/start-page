import { FilterType } from "hooks/useFilters";

import Button from "../common/Button";
import ModalTemplate from "../common/ModalTemplate";
import SubscriptionOption from './SubscriptionOption';

interface Props {
    displayState?: FilterType<boolean>;
    closeModal: () => void;
    setDisplayFlag: (target: string, value: boolean) => void;
    refetchFeeds: () => void;
}

interface ButtonsDataValue {
    customStyle: string;
    clickHandler: () => void;
}

interface ButtonsData {
    [key: string]: ButtonsDataValue;
}

export default function FilterBySource({
    displayState,
    closeModal,
    setDisplayFlag,
    refetchFeeds,
}: Props) {
    if (displayState == null || Object.keys(displayState).length === 0) {
        return <></>;
    }

    const title = "표시할 출처를 선택해주세요";

    const changeDisplayFlag = (target: string, value: boolean) => () => {
        setDisplayFlag(target, value);
    };

    const enableDisplayFilter = () => {
        closeModal();
        refetchFeeds();
    };

    const initiateDisplayFilter = () => {
        Object.keys(displayState).forEach((key: string) =>
            setDisplayFlag(key, true)
        );
    };

    const subscriptionOptions = Object.keys(displayState).map(
        (origins: string, index: number) => {
            return (
                <SubscriptionOption
                    key={origins}
                    alternativeString={`blog_${index}`}
                    displayState={displayState}
                    origins={origins}
                    changeDisplayFlag={changeDisplayFlag}
                />
            );
        }
    );

    const buttonsData: ButtonsData = {
        취소: {
            customStyle: "w-16 bg-red-600 dark:bg-red-700",
            clickHandler: closeModal,
        },
        초기화: {
            customStyle: "w-16",
            clickHandler: initiateDisplayFilter,
        },
        저장: {
            customStyle: "w-16 bg-blue-600 dark:bg-sky-600",
            clickHandler: enableDisplayFilter,
        },
    };
    const filterHandlersList = Object.entries(buttonsData).map(
        (buttonData: [string, ButtonsDataValue], index: number) => {
            const [buttonText, buttonDataValue] = buttonData;
            const { customStyle, clickHandler } = buttonDataValue;
            return (
                <Button
                    key={`${buttonText}_${index}`}
                    type="button"
                    customStyle={customStyle}
                    clickHandler={clickHandler}
                >
                    {buttonText}
                </Button>
            );
        }
    );

    return (
        <section className="h-full">
            <ModalTemplate
                headingTitle={title}
                listItems={subscriptionOptions}
            />
            <div className="flex justify-evenly w-full">
                {filterHandlersList}
            </div>
        </section>
    );
}
