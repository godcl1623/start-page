import { SourceData } from "controllers/sources";

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

    return (
        <CancelSubscriptionView sources={sources} handleClick={handleClick} />
    );
}
