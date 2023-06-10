import { FAKE_MEDS_REMINDER } from "@/utils/testData";
import styles from "../../styles/components/MedicationContainer.module.css";
import { ALL_DAYS, DAY_BACKGROUNDS, DAY_NUMBERS } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { MEDICATION_QUERIES } from "@/utils/queries";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contractInfo";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useConnect,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export const MedicationContainer = () => {
  const [showPopup, setShowPopup] = useState(false);

  const connector = new MetaMaskConnector();
  const { address: account } = useAccount();
  const { connect } = useConnect();

  // Meds Parameters
  const [tabsAmount, setTabsAmount] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState(["", ""]);
  const [dosage, setDosage] = useState([]);
  const [description, setDescription] = useState<string>("");

  const { loading, error, data } = useQuery(MEDICATION_QUERIES, {
    variables: { deleted: false, userAddress: account },
  });

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "create_medication",
    args: [
      account,
      {
        total_tabs_amount: tabsAmount,
        days: selectedDays,
        name: name,
        dosage: dosage,
        desc: description,
      },
    ],
  });
  const { write: create } = useContractWrite(config);
  //@ts-ignore
  const handleInputChange = (event, index) => {
    //@ts-ignore
    const newDosage: [] = [...dosage];
    //@ts-ignore
    newDosage[index] = event.target.value;
    setDosage(newDosage);
  };

  //@ts-ignore
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const result = dosage.map((dose) => Number(dose));
  };

  console.log("DATA", data);

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

    if (!selectedDays.includes(number))
      setSelectedDays((prevSelectedDays) => [...prevSelectedDays, number]);
  };

  useEffect(() => {
    connect({ connector });
  }, []);

  return (
    <div className={styles.medicationContainer}>
      <div className={showPopup ? styles.titleBlur : styles.title}>
        <h3>Medication Reminders</h3>
        <button onClick={handleOpenPopup}>Add</button>
      </div>

      <div className={showPopup ? styles.medBoxesBlur : styles.medBoxes}>
        {data && data.medications.length > 0 ? (
          //@ts-ignore
          data.medications.map((meds) => {
            return (
              <div className={styles.medBox}>
                {/* img and total amount */}
                <div className={styles.imgAndTotalAmount}>
                  <img src="/icons/drugs.png" />
                  <div className={styles.amount}>
                    <h4>Total Amount</h4>
                    <p>{meds.totalTabsAmount}</p>
                  </div>
                </div>

                {/*days */}
                <div className={styles.days}>
                  {/* @ts-ignore */}
                  {meds.days.map((day) => {
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

                {/* name and dosage */}
                <div className={styles.nameAndDosage}>
                  <div className={styles.name}>
                    <h4>Name</h4>
                    <p>{meds.name}</p>
                  </div>

                  <div className={styles.dosage}>
                    <h4>Dosage</h4>
                    <p>{meds.dosage[0] + " X " + meds.dosage[1] + " daily"}</p>
                  </div>
                </div>

                {/* description */}
                <div className={styles.description}>
                  <h4>Description</h4>
                  <p>{meds.desc}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No Medications</p>
        )}
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.createTitle}>
            <p>Create Meds Reminder</p>
            <img src="/icons/cancel.png" onClick={handleClosePopup} />
          </div>

          <h5>Tabs Amount</h5>
          <input onChange={(e) => setTabsAmount(e.target.value)} />

          <h5>Name</h5>
          <input onChange={(e) => setName(e.target.value)} />

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

          <h5>Dosage</h5>
          <div className={styles.selectDosage}>
            <input
              value={dosage[0]}
              onChange={(e) => handleInputChange(e, 0)}
            />
            <p>Tab(s)</p>
            <input
              value={dosage[1]}
              onChange={(e) => handleInputChange(e, 1)}
            />
            <p>times daily</p>
          </div>

          <h5>Description</h5>
          <input onChange={(e) => setDescription(e.target.value)} />

          <button disabled={!create} onClick={() => create?.()}>
            Create
          </button>
        </div>
      )}
    </div>
  );
};
