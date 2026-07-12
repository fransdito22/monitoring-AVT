interface Props {
    label: string;

    value: string;

    onChange: (value: string) => void;
}

export default function FormTextarea({ label, value, onChange }: Props) {
    return (
        <div className="space-y-2">
            <label className="font-medium">{label}</label>

            <textarea
                className="
    border rounded-lg
    w-full p-3
    "
                rows={4}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
