import { FilterType } from "hooks/useFilters";
import Button from "../../common/Button";
import ModalTemplate from "../common/ModalTemplate";
import SubscriptionOption from "./SubscriptionOption";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

interface Props {
    displayState: FilterType<boolean>;
    changeDisplayFlag: (target: string, value: boolean) => void;
    closeModal: () => void;
    enableDisplayFilter: (callback?: () => void) => () => void;
    initiateDisplayFilter: () => void;
}

interface ButtonsDataValue {
    customStyle: string;
    clickHandler: () => void;
}

interface ButtonsData {
    [key: string]: ButtonsDataValue;
}

export default function FilterBySourceView({
    displayState,
    changeDisplayFlag,
    closeModal,
    enableDisplayFilter,
    initiateDisplayFilter,
}: Readonly<Props>) {
    const [visibleState, setVisibleState] = useState<FilterType<boolean>>({});
    const title = "표시할 출처를 선택해주세요";

    const updateVisibleState = (target: string, value: boolean) => () => {
        setVisibleState((oldState) => ({
            ...oldState,
            [target]: value,
        }));
    };

    const saveDisplayState = () => {
        Object.entries(visibleState).forEach(([feedSource, state]) => {
            changeDisplayFlag(feedSource, state);
        });
    };

    useEffect(() => {
        if (displayState != null) {
            Object.entries(displayState).forEach(([feedsSource, state]) => {
                setVisibleState((oldState) => ({
                    ...oldState,
                    [feedsSource]: state,
                }));
            });
        }
    }, [displayState]);

    const subscriptionOptions = Object.keys(visibleState).map(
        (origins: string, index: number) => {
            return (
                <SubscriptionOption
                    key={origins}
                    alternativeString={`blog_${index}`}
                    visibleState={visibleState}
                    origins={origins}
                    changeDisplayFlag={updateVisibleState}
                />
            );
        }
    );

    const buttonsData: ButtonsData = {
        취소: {
            customStyle:
                "w-16 bg-red-400 font-bold text-neutral-100 dark:bg-red-700 dark:text-gray-300",
            clickHandler: closeModal,
        },
        초기화: {
            customStyle:
                "w-16 bg-neutral-500 font-bold text-neutral-100 dark:bg-neutral-500 dark:text-gray-300",
            clickHandler: initiateDisplayFilter,
        },
        저장: {
            customStyle:
                "w-16 bg-sky-400 font-bold text-neutral-100 dark:bg-sky-600 dark:text-gray-300",
            clickHandler: enableDisplayFilter(saveDisplayState),
        },
    };
    const filterHandlersList = Object.entries(buttonsData).map(
        (buttonData: [string, ButtonsDataValue]) => {
            const [buttonText, buttonDataValue] = buttonData;
            const { customStyle, clickHandler } = buttonDataValue;
            return (
                <Button
                    key={`${buttonText}_${nanoid()}`}
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
