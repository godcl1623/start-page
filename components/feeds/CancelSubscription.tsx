import React from "react";
import { SourceData } from "controllers/sources";
import Button from "./Button";
import DeleteButtonWrapper from 'components/common/DeleteButtonWrapper';

interface Props {
    sources: string;
}

interface CheckboxValue {
    sourceId: number;
    checked: boolean;

}

interface SourcesList {
    sources: SourceData[];
}

export default function CancelSubscription({
    sources,
}: Props) {
    const [subscriptionList, setSubscriptionList] = React.useState<SourceData[]>(
        []
    );

    React.useEffect(() => {
        if (sources != null) {
            const { sources: sourcesList }: SourcesList = JSON.parse(sources);
            setSubscriptionList(previousArray => previousArray.slice(previousArray.length).concat(sourcesList));
        }
    }, [sources]);

    const subscriptionOptions = Object.keys(subscriptionList).map(
        (origins: string, index: number) => {
            const { id, name }: SourceData = subscriptionList[index];
            return (
                <li
                    key={origins}
                    className="flex justify-between w-full py-2 px-4 list-none cursor-pointer select-none"
                >
                    <div>
                        {name || `blog_${index}`}
                    </div>
                    <DeleteButtonWrapper deleteTarget={id}>
                        <Button type="button" customStyle='bg-red-600 dark:bg-red-700'>삭제</Button>
                    </DeleteButtonWrapper>
                </li>
            );
        }
    );

    return (
        <section className="h-full">
            <div
                className="w-full h-full"
            >
                <h1 className="mb-4 text-xl">
                    구독을 취소할 블로그 / 사이트를
                    <br />
                    선택해주세요.
                </h1>
                <ul className="relative flex-center flex-col w-full h-full mb-4">
                    {subscriptionOptions}
                </ul>
            </div>
        </section>
    );
}
