import { FAKE_DAILY_ROUTINES, FAKE_MEDS_REMINDER } from "@/utils/testData";
import styles from "../../styles/components/DailyRoutineContainer.module.css";
import {
  ALL_DAYS,
  DAY_BACKGROUNDS,
  DAY_NUMBERS,
  IMPORTANCE_ARRAY,
  IMPORTANCE_LEVELS,
  ROUTINE_IMPORTANCE,
} from "@/utils/helpers";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contractInfo";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useQuery } from "@apollo/client";
import { DAILY_ROUTINE_QUERIES } from "@/utils/queries";

// @ts-ignore
export const DailyRoutineContainer = ({ aides, user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [routineDescriptionInput, setRoutineDescriptionInput] = useState();
  const [selectedImportance, setSelectedImportance] = useState();
  const [selectedReminderId, setselectedReminderId] = useState<string>("");

  const { address: account } = useAccount();
  const connector = new MetaMaskConnector();
  const { connect } = useConnect();

  const { loading, error, data } = useQuery(DAILY_ROUTINE_QUERIES, {
    variables: { deleted: false, userAddress: aides ? user : account },
  });

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "create_daily_routine",
    args: [
      account,
      {
        days: selectedDays,
        importance: selectedImportance,
        routine_description: routineDescriptionInput,
      },
    ],
  });
  const { write: create } = useContractWrite(config);

  const { config: deleteConfig, error: deleteError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "delete_daily_routine",
    args: [account, selectedReminderId],
  });
  const { write: deleteDailyRoutine } = useContractWrite(deleteConfig);

  // Functions
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  //@ts-ignore
  const handleDayClick = (dayIndex) => {
    const number = dayIndex + 1;
    //@ts-ignore
    if (!selectedDays.includes(number))
      //@ts-ignore
      setSelectedDays((prevSelectedDays) => [...prevSelectedDays, number]);
  };

  useEffect(() => {
    connect({ connector });
  }, []);

  console.log(data);

  return (
    <div className={styles.dailyRoutineContainer}>
      <div className={showPopup ? styles.titleBlur : styles.title}>
        <h3>Daily Routines</h3>
        {deleteError && !deleteError.message.includes("#01") && (
          <button onClick={handleOpenPopup}>Add</button>
        )}
      </div>

      <div
        className={
          showPopup ? styles.dailyRoutineBoxesBlur : styles.dailyRoutineBoxes
        }
      >
        {data && data.dailyRoutines.length > 0 ? (
          //@ts-ignore
          data.dailyRoutines.map((routine) => {
            return (
              <div className={styles.dailyRoutineBox}>
                <div className={styles.left}>
                  <h3>Days</h3>
                  {/*days */}
                  <div className={styles.days}>
                    {/* @ts-ignore */}
                    {routine.days.map((day) => {
                      return (
                        <p
                          className={styles.day}
                          //@ts-ignore
                          style={{ backgroundColor: DAY_BACKGROUNDS[day] }}
                        >
                          {/* @ts-ignore */}
                          {DAY_NUMBERS[day]}
                        </p>
                      );
                    })}
                  </div>

                  {routine.reminderId != selectedReminderId &&
                    deleteError &&
                    !deleteError.message.includes("#01") && (
                      <button
                        className={styles.delete}
                        onClick={() => {
                          setselectedReminderId(routine.reminderId);
                        }}
                      >
                        Delete
                      </button>
                    )}

                  {routine.reminderId == selectedReminderId &&
                    deleteError &&
                    !deleteError.message.includes("#01") && (
                      <button
                        className={styles.confirmDelete}
                        disabled={!deleteDailyRoutine}
                        onClick={() => deleteDailyRoutine?.()}
                      >
                        Confirm Delete
                      </button>
                    )}
                </div>

                <div className={styles.right}>
                  {/* importancee */}
                  <div className={styles.importance}>
                    <h4>Importance</h4>
                    <div
                      className={styles.importanceBar}
                      style={{
                        //@ts-ignore
                        backgroundColor: ROUTINE_IMPORTANCE[routine.importance],
                      }}
                    ></div>
                  </div>
                  {/* routine description*/}
                  <div className={styles.routine}>
                    <h4>Routine</h4>
                    <p>{routine.desc}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No Daily Routines Set.</p>
        )}
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.createTitle}>
            <p>Create Daily Routine</p>
            <img src="/icons/cancel.png" onClick={handleClosePopup} />
          </div>

          <div className={styles.createRoutineDescription}>
            <h5>Routine Description</h5>
            <textarea
              className={styles.createRoutineDescriptionInput}
              //@ts-ignore
              onChange={(e) => setRoutineDescriptionInput(e.target.value)}
            />
          </div>

          <h5>Days</h5>
          <div className={styles.days}>
            {ALL_DAYS.map((day, index) => {
              return (
                <p
                  className={styles.day}
                  style={{
                    //@ts-ignore
                    backgroundColor: selectedDays.includes(index + 1)
                      ? "#000"
                      : //@ts-ignore
                        DAY_BACKGROUNDS[day],
                    //@ts-ignore
                    color: selectedDays.includes(index + 1) && "#fff",
                  }}
                  onClick={() => handleDayClick(index)}
                >
                  {/* @ts-ignore */}
                  {DAY_NUMBERS[day]}
                </p>
              );
            })}
          </div>

          <div className={styles.createImportance}>
            <h5>Importance</h5>
            <h6>
              Selected Importance :{/* @ts-ignore */}
              <span>{IMPORTANCE_LEVELS[selectedImportance]}</span>
            </h6>

            <div className={styles.importanceColors}>
              {/* IM HERRREEE */}
              {IMPORTANCE_ARRAY.map((importance, index) => {
                return (
                  <div
                    //@ts-ignore
                    style={{ backgroundColor: ROUTINE_IMPORTANCE[importance] }}
                    className={styles.importanceColor}
                    //@ts-ignore
                    onClick={() => setSelectedImportance(importance)}
                  ></div>
                );
              })}
            </div>
          </div>

          <button disabled={!create} onClick={() => create?.()}>
            Create
          </button>
        </div>
      )}
    </div>
  );
};
