import {
  FAKE_APPOINTMENT_DATA,
  FAKE_DAILY_ROUTINES,
  FAKE_MEDS_REMINDER,
} from "@/utils/testData";
import styles from "../../styles/components/AppointmentContainer.module.css";
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
import { APPOINTMENT_QUERIES } from "@/utils/queries";

export const AppointmentContainer = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [appointmentDescription, setAppointmentDescription] =
    useState<string>("");
  const [selectedImportance, setSelectedImportance] = useState();
  const [locationDescription, setLocationDescription] = useState<string>();

  const { address: account } = useAccount();
  const connector = new MetaMaskConnector();
  const { connect } = useConnect();

  const { data } = useQuery(APPOINTMENT_QUERIES, {
    variables: { deleted: false, userAddress: account },
  });

  console.log(data);

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "create_appointment",
    args: [
      account,
      {
        days: selectedDays,
        importance: selectedImportance,
        location: locationDescription,
        appointment_desc: appointmentDescription,
      },
    ],
  });
  const { write: create } = useContractWrite(config);

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

  return (
    <div className={styles.appointmentContainer}>
      <div className={showPopup ? styles.titleBlur : styles.title}>
        <h3>Appointments</h3>
        <button onClick={handleOpenPopup}>Add</button>
      </div>

      <div
        className={
          showPopup ? styles.appointmentBoxesBlur : styles.appointmentBoxes
        }
      >
        {data && data.appointments.length > 0 ? (
          //@ts-ignore
          data.appointments.map((appointment) => {
            return (
              <div className={styles.appointmentBox}>
                {/* importancee */}
                <div className={styles.importance}>
                  <h4>Importance</h4>
                  <div
                    className={styles.importanceBar}
                    style={{
                      backgroundColor:
                        //@ts-ignore
                        ROUTINE_IMPORTANCE[appointment.importance],
                    }}
                  ></div>
                </div>

                {/* appointment description*/}
                <div className={styles.appointmentDescription}>
                  <h4>Appointment</h4>
                  <p>{appointment.desc}</p>
                </div>

                <div className={styles.bottom}>
                  {/*days */}
                  <div className={styles.days}>
                    {/* @ts-ignore */}
                    {appointment.days.map((day) => {
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

                  {/* location description*/}
                  <div className={styles.location}>
                    <h4>Location</h4>
                    <p>{appointment.locationDescription}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No Appointments Set</p>
        )}
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.createTitle}>
            <p>Create Daily Routine</p>
            <img src="/icons/cancel.png" onClick={handleClosePopup} />
          </div>

          <div className={styles.createAppointmentDescription}>
            <h5>Appointment Description</h5>
            <textarea
              className={styles.createAppointmentDescriptionInput}
              onChange={(e) => setAppointmentDescription(e.target.value)}
            />
          </div>

          <div className={styles.createLocationDescription}>
            <h5>Location Description</h5>
            <textarea
              className={styles.createLocationDescriptionInput}
              onChange={(e) => setLocationDescription(e.target.value)}
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
