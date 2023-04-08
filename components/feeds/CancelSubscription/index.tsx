import { SourceData } from "controllers/sources";

import useCancelSubscription from "./hooks/useCancelSubscription";

import CancelSubscriptionView from "./CancelSubscriptionView";

interface Props {
    sources: SourceData[];
}

export default function CancelSubscription({ sources }: Props) {
    const cancelSubscription = useCancelSubscription();
    const handleClick = (deleteTarget: number) => () =>
        cancelSubscription(deleteTarget);

    return (
        <CancelSubscriptionView sources={sources} handleClick={handleClick} />
    );
}
