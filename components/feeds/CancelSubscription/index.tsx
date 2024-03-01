import { SourceData } from "controllers/sources/helpers";

import useCancelSubscription from "./hooks/useCancelSubscription";

import CancelSubscriptionView from "./CancelSubscriptionView";

interface Props {
    sources: SourceData[];
    userId: string;
}

export default function CancelSubscription({ sources, userId }: Props) {
    const cancelSubscription = useCancelSubscription(userId);

    const handleClick = (deleteTarget: number) => () =>
        cancelSubscription(deleteTarget);

    if (sources == null || sources.length === 0) {
        return (
            <div className=" flex justify-center items-center h-40">
                구독 중인 사이트가 없습니다.
            </div>
        );
    }

    return (
        <CancelSubscriptionView sources={sources} handleClick={handleClick} />
    );
}
