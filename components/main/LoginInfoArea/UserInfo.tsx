interface Props {
    userEmail: string | undefined;
}

export default function UserInfo({ userEmail }: Props) {
    if (userEmail == null) {
        return <button type="button">Guest</button>;
    }
    return <button type="button">{userEmail}</button>;
}
