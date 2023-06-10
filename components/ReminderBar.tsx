import styles from "../styles/components/ReminderBar.module.css";
import Link from "next/link";

//@ts-ignore
export const ReminderBar = ({ setOption, option }) => {
  //
  function setOptionLink(optionType: string) {
    setOption(optionType);
  }
  //
  return (
    <div className={styles.reminderBar}>
      <p
        className={option == "medication" ? styles.selectedP : ""}
        onClick={() => setOptionLink("medication")}
      >
        Medication
      </p>
      <p
        className={option == "daily routines" ? styles.selectedP : ""}
        onClick={() => setOptionLink("daily routines")}
      >
        Daily Routine{" "}
      </p>
      <p
        className={option == "appointments" ? styles.selectedP : ""}
        onClick={() => setOptionLink("appointments")}
      >
        Appointments
      </p>
    </div>
  );
};
