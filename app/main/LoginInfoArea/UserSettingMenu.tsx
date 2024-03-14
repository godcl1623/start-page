import Button from "components/common/Button";
import { ChangeEvent } from "react";
import { MdDarkMode, MdFormatColorReset, MdLightMode } from "react-icons/md";
import { Theme } from ".";
import { nanoid } from "nanoid";
import { useRouter } from 'next/navigation';

interface Props {
    toggleButtonRef: HTMLButtonElement | null;
    isDark: boolean;
    isSystemTheme: boolean;
    updateUserMenu: (value: HTMLDivElement | null) => void;
    updateModalState: (value: boolean) => () => void;
    getTotalData: () => void;
    uploadUserData: (event: ChangeEvent<HTMLInputElement>) => void;
    handleUserData: () => void;
    handleTheme: (value: Theme) => () => void;
    mailTo: () => void;
}

export default function UserSettingMenu({
    toggleButtonRef,
    isDark,
    isSystemTheme,
    updateUserMenu,
    updateModalState,
    getTotalData,
    uploadUserData,
    handleUserData,
    handleTheme,
    mailTo,
}: Readonly<Props>) {
    const router = useRouter();
    const commonButtonStyle =
        "w-44 px-4 py-2 rounded-md bg-neutral-500 text-sm text-neutral-100 dark:text-gray-300";
    const buttonsData = [
        {
            text: "사용자 데이터 내보내기",
            style: commonButtonStyle,
            clickHandler: getTotalData,
        },
        {
            text: "사용자 데이터 불러오기",
            style: `${commonButtonStyle} text-center cursor-pointer`,
            clickHandler: uploadUserData,
        },
        {
            text: "데이터 이전",
            style: commonButtonStyle,
            clickHandler: handleUserData,
        },
        {
            text: '이용 가이드',
            style: commonButtonStyle,
            clickHandler: () => router.push(process.env.NEXT_PUBLIC_USAGE_GUIDE ?? '/')
        },
        {
            text: "문의하기",
            style: commonButtonStyle,
            clickHandler: mailTo,
        },
    ];

    const buttonsList = buttonsData.map((buttonData, index, arraySelf) => {
        if (index === 1) {
            return (
                <label
                    className={buttonData.style}
                    key={`${buttonData.text}_${nanoid()}`}
                >
                    {buttonData.text}
                    <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={
                            buttonData.clickHandler as (
                                event: ChangeEvent<HTMLInputElement>
                            ) => void
                        }
                    />
                </label>
            );
        } else {
            return (
                <Button
                    type="button"
                    customStyle={buttonData.style}
                    clickHandler={buttonData.clickHandler as () => void}
                    key={`${buttonData.text}_${nanoid()}`}
                >
                    {buttonData.text}
                </Button>
            );
        }
    });
    return (
        <div
            ref={updateUserMenu}
            className={`absolute top-0 z-20 w-full md:top-20 md:w-max`}
            style={{
                right:
                    toggleButtonRef &&
                    document.documentElement.offsetWidth > 768
                        ? toggleButtonRef.offsetWidth
                        : 0,
            }}
        >
            <div className="flex flex-col gap-4 justify-center items-center w-full p-4 rounded-md shadow-lg bg-neutral-100 dark:bg-neutral-700 dark:shadow-zinc-600 md:gap-6 md:w-80">
                {document.documentElement.offsetWidth < 768 ? (
                    <button
                        type="button"
                        className="absolute top-4 right-4 flex justify-center items-center w-4 h-4 text-neutral-700 dark:text-neutral-100"
                        onClick={updateModalState(false)}
                    >
                        ✕
                    </button>
                ) : (
                    <></>
                )}
                {buttonsList}
                <div className="flex justify-evenly w-44 py-2">
                    <button type="button" onClick={handleTheme("light")}>
                        <MdLightMode
                            className={`w-8 h-8 ${
                                !isDark && !isSystemTheme
                                    ? "fill-yellow-400"
                                    : "fill-neutral-500"
                            }`}
                        />
                    </button>
                    <button type="button" onClick={handleTheme("system")}>
                        <MdFormatColorReset
                            className={`w-8 h-8 ${
                                isSystemTheme
                                    ? !isDark
                                        ? "fill-yellow-400"
                                        : "fill-blue-400"
                                    : "fill-neutral-500"
                            }`}
                        />
                    </button>
                    <button type="button" onClick={handleTheme("dark")}>
                        <MdDarkMode
                            className={`w-8 h-8 ${
                                isDark && !isSystemTheme
                                    ? "fill-blue-400"
                                    : "fill-neutral-500"
                            }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
