import { SourceData } from "controllers/sources/helpers";
import Button from "../../common/Button";
import ListItemBox from "../common/ListItemBox";
import ModalTemplate from "../common/ModalTemplate";

interface Props {
    sources: SourceData[];
    handleClick: (deleteTarget: number) => () => void;
}

export default function CancelSubscriptionView({
    sources,
    handleClick,
}: Props) {
    const title = "구독을 취소할 사이트를 선택해주세요.";

    const subscriptionOptions =
        sources != null && sources.length > 0 ? (
            Object.keys(sources).map((origins: string, index: number) => {
                const { id, name }: SourceData = sources[index];
                return (
                    <ListItemBox key={origins}>
                        <p className="mr-4 pt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                            {name || `blog_${index}`}
                        </p>
                        <Button
                            type="button"
                            customStyle="w-16 min-w-16 bg-red-400 font-bold text-xs text-neutral-100 dark:bg-red-700 dark:text-gray-300"
                            clickHandler={handleClick(id)}
                        >
                            삭제
                        </Button>
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
