import styles from "../styles/components/IrisBar.module.css";
import Link from "next/link";

// @ts-ignore
export const IrisBar = ({ setOption, option }) => {
  //
  function setOptionLink(optionType: string) {
    setOption(optionType);
  }
  //
  return (
    <div className={styles.reminderBar}>
      <p
        className={option == "feed memory" ? styles.selectedP : ""}
        onClick={() => setOptionLink("feed memory")}
      >
        Store With Iris
      </p>
      <p
        className={option == "ask memory" ? styles.selectedP : ""}
        onClick={() => setOptionLink("ask memory")}
      >
        Hear From Iris
      </p>
    </div>
  );
};
