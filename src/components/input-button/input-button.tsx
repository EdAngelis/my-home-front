import styles from "./input-button.module.css";

type Props = {
  type?: string;
  label: string;
  value: string;
  onClick: () => void;
  onInputChange: (value: any) => void;
};

export default function InputButton({
  label,
  onClick,
  type = "text",
  onInputChange,
}: Props) {
  const onChange = (event: any) => {
    onInputChange(event.target.value);
  };

  return (
    <div className={styles.container}>
      <input className={styles.input} type={type} onChange={onChange} />
      <button className={styles.button} onClick={onClick}>
        {label}
      </button>
    </div>
  );
}
