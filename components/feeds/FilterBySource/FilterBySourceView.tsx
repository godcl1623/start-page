import { FilterType } from "hooks/useFilters";
import Button from "../../common/Button";
import ModalTemplate from "../common/ModalTemplate";
import SubscriptionOption from "./SubscriptionOption";

interface Props {
    displayState: FilterType<boolean>;
    changeDisplayFlag: (target: string, value: boolean) => () => void;
    closeModal: () => void;
    enableDisplayFilter: () => void;
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
}: Props) {
    const title = "표시할 출처를 선택해주세요";

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
            customStyle: "w-16 bg-red-400 text-neutral-100 dark:bg-red-700",
            clickHandler: closeModal,
        },
        초기화: {
            customStyle: "w-16",
            clickHandler: initiateDisplayFilter,
        },
        저장: {
            customStyle: "w-16 bg-sky-500 text-neutral-100 dark:bg-sky-600",
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
