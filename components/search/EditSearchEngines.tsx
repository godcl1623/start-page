import Button from "components/common/Button";
import RequestControllers from 'controllers/requestControllers';
import { memo, useEffect } from "react";

interface Props {
    userId: string;
    closeModal: () => void;
}

export default memo(function EditSearchEngines({ userId, closeModal }: Props) {
    const buttonStyle = "w-16 text-neutral-100";
    const tableRowStyle = "flex w-full border-b";
    const siteNameStyle = "w-[20%] border-r";
    const queryStyle = "w-[65%]";
    const queryManageStyle = "flex w-[15%]";
    const queryManageButtonStyle = "w-1/2";
    const { getDataFrom } = new RequestControllers();

    useEffect(() => {
        getDataFrom(`/search_engines?userId=${userId}`).then((foo) => console.log(foo))
    }, []);

    return (
        <section className="h-full w-full p-4">
            <table className="h-full w-full mb-8 border border-b-0">
                <tr className={tableRowStyle}>
                    <th className={siteNameStyle}>사이트명</th>
                    <th className={`w-4/5`}>쿼리문 주소</th>
                </tr>
                <tr className={tableRowStyle}>
                    <td className={siteNameStyle}>Google</td>
                    <td className={queryStyle}>
                        {'https://www.google.com/search?q='}
                    </td>
                    <td className={queryManageStyle}>
                        <div className={queryManageButtonStyle}>편집</div>
                        <div className={queryManageButtonStyle}>삭제</div>
                    </td>
                </tr>
                <tr className={tableRowStyle}>
                    <td className={siteNameStyle}>
                        <input className='w-full' />
                    </td>
                    <td className={queryStyle}>
                        <input className='w-full' />
                    </td>
                    <td className={queryManageStyle}>
                        <div className={queryManageButtonStyle}>저장</div>
                        <div className={queryManageButtonStyle}>취소</div>
                    </td>
                </tr>
                <tr>
                    <td>추가</td>
                </tr>
            </table>
            <div className="flex justify-evenly w-full">
                <Button
                    type="button"
                    customStyle={`${buttonStyle} bg-red-400 dark:bg-red-700`}
                    clickHandler={closeModal}
                >
                    취소
                </Button>
                <Button
                    type="button"
                    customStyle={`${buttonStyle} bg-sky-500 dark:bg-sky-600`}
                >
                    저장
                </Button>
            </div>
        </section>
    );
});
