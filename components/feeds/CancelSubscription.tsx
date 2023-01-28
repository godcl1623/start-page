import { useEffect, useState } from "react";

import { SourceData } from "controllers/sources";

import Button from "./common/Button";
import DeleteButtonWrapper from "components/common/DeleteButtonWrapper";
import ListItemBox from "./common/ListItemBox";
import ModalTemplate from "./common/ModalTemplate";

interface Props {
    sources: SourceData[];
}

export default function CancelSubscription({ sources }: Props) {
    const title = (
        <>
            구독을 취소할 블로그 / 사이트를
            <br />
            선택해주세요.
        </>
    );

    const subscriptionOptions =
        sources != null && sources.length > 0 ? (
            Object.keys(sources).map((origins: string, index: number) => {
                const { id, name }: SourceData = sources[index];
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
            })
        ) : (
            <></>
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
