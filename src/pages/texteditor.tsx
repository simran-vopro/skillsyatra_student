import  { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

type Props = {
    value: string;
    placeholder?: string;
    onChange: (content: string) => void;
};

export default function TextEditor({ value, placeholder, onChange }: Props) {
    const editor = useRef(null);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: placeholder ? placeholder : 'Start typing...',
        }),
        []
    );

    return (
        <div>
            <JoditEditor
                ref={editor}
                value={value}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => onChange(newContent)}
                onChange={() => { }} // no-op to prevent unnecessary renders
            />
        </div>
    );
}
