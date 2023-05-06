import { signIn } from "next-auth/react";
import Image, { StaticImageData } from "next/image";
import googleLoginButtonImage from "./assets/btn_google_signin_light_pressed_web@2x.png";
import naverLoginButtonImage from "./assets/naver_login.png";
import kakaoLoginButtonImage from "./assets/kakao_login_medium_narrow.png";

interface ButtonsMetaData {
    service: string;
    src: StaticImageData;
}

const BUTTONS_META_DATA: ButtonsMetaData[] = [
    {
        service: "google",
        src: googleLoginButtonImage,
    },
    { service: "naver", src: naverLoginButtonImage },
    { service: "kakao", src: kakaoLoginButtonImage },
];

export default function LoginView() {
    const loginButtons = BUTTONS_META_DATA.map((buttonData, index) => (
        <li
            key={`${buttonData.service}_${index}`}
            className={`flex justify-center items-center ${buttonData.service === 'google' ? 'my-5' : 'my-6'}`}
        >
            <button
                type="button"
                onClick={() => signIn(buttonData.service)}
                className={`relative ${
                    buttonData.service !== "google"
                        ? "w-[179px] h-[41px]"
                        : "w-[183px] h-[45px]"
                }`}
            >
                <Image
                    src={buttonData.src}
                    alt={`login_button_${buttonData.service}`}
                    layout="fill"
                />
            </button>
        </li>
    ));
    return <ul>{loginButtons}</ul>;
}
