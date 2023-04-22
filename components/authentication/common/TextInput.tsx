import { ChangeEvent, HTMLInputTypeAttribute, useState } from "react";

interface Props {
    type?: "text" | "email" | "password";
    placeholder?: string;
    name?: string;
    className?: string;
    required?: boolean;
}

export default function TextInput({
    type,
    placeholder,
    name,
    className,
    required,
}: Props) {
    const [inputValue, setInputValue] = useState<string>("");
    const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.currentTarget.value);
    };

    return (
        <input
            type={type == null ? "text" : type}
            placeholder={placeholder}
            name={name}
            className={className}
            required={required}
            value={inputValue}
            onChange={updateValue}
        />
    );
}
