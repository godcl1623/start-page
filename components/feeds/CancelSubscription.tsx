import { useEffect, useState } from "react";

import { SourceData } from "controllers/sources";

import Button from "./common/Button";
import DeleteButtonWrapper from "components/common/DeleteButtonWrapper";
import ListItemBox from "./common/ListItemBox";
import ModalTemplate from "./common/ModalTemplate";

interface Props {
    sources: string;
}

export interface SourcesList {
    sources: SourceData[];
}

export default function CancelSubscription({ sources }: Props) {
    const [subscriptionList, setSubscriptionList] = useState<SourceData[]>([]);

    const title = (
        <>
            구독을 취소할 블로그 / 사이트를
            <br />
            선택해주세요.
        </>
    );

    // TODO: 상위 컴포넌트에서 파싱된 데이터를 전달하도록 수정
    useEffect(() => {
        if (sources != null) {
            const { sources: sourcesList }: SourcesList = JSON.parse(sources);
            setSubscriptionList((previousArray) =>
                previousArray.slice(previousArray.length).concat(sourcesList)
            );
        }
    }, [sources]);

    const subscriptionOptions = Object.keys(subscriptionList).map(
        (origins: string, index: number) => {
            const { id, name }: SourceData = subscriptionList[index];
            return (
                <ListItemBox key={origins}>
                    <div>{name || `blog_${index}`}</div>
                    <DeleteButtonWrapper deleteTarget={id}>
                        <Button
                            type="button"
                            customStyle="bg-red-600 dark:bg-red-700"
                        >
                            삭제
                        </Button>
                    </DeleteButtonWrapper>
                </ListItemBox>
            );
        }
    );

    return (
        <section className="h-full">
            <ModalTemplate
                headingTitle={title}
                listItems={subscriptionOptions}
            />
        </section>
    );
}
