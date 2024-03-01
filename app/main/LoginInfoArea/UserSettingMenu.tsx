import Button from "components/common/Button";
import { ChangeEvent } from 'react';
import { MdDarkMode, MdFormatColorReset, MdLightMode } from "react-icons/md";
import { Theme } from '.';

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
    handleTheme
}: Readonly<Props>) {
    return (
        <div
            ref={updateUserMenu}
            className={`absolute top-0 z-10 w-full md:top-20 md:w-max`}
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
                <Button
                    type="button"
                    customStyle="w-44 px-4 py-2 rounded-md bg-neutral-500 text-sm text-neutral-100 dark:text-gray-300"
                    clickHandler={getTotalData}
                >
                    사용자 데이터 내보내기
                </Button>
                <label className="w-44 px-4 py-2 rounded-md bg-neutral-500 text-center text-sm text-neutral-100 cursor-pointer dark:text-gray-300">
                    사용자 데이터 불러오기
                    <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={uploadUserData}
                    />
                </label>
                <Button
                    type="button"
                    customStyle="w-44 px-4 py-2 rounded-md bg-neutral-500 text-sm text-neutral-100 dark:text-gray-300"
                    clickHandler={handleUserData}
                >
                    데이터 이전
                </Button>
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
