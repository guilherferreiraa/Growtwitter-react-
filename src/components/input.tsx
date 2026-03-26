export function Input({ value, onChange, theme, placeholder }: any) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        background: "transparent",
        color: theme.text,
        border: "none",
        outline: "none",
        fontSize: "1.2rem",
        resize: "none",
      }}
    />
  );
}