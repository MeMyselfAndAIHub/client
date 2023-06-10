import { gql } from "@apollo/client";

export const MEDICATION_QUERIES = gql`
  query GetMedications($deleted: Boolean, $userAddress: Bytes) {
    medications(where: { deleted: $deleted, userAddress: $userAddress }) {
      id
      userAddress
      totalTabsAmount
      days
      name
      dosage
      desc
      deleted
    }
  }
`;

export const DAILY_ROUTINE_QUERIES = gql`
  query GetDailyRoutines($deleted: Boolean, $userAddress: Bytes) {
    dailyRoutines(where: { deleted: $deleted, userAddress: $userAddress }) {
      id
      userAddress
      days
      importance
      desc
      deleted
    }
  }
`;

export const APPOINTMENT_QUERIES = gql`
  query GetAQppointments($deleted: Boolean, $userAddress: Bytes) {
    appointments(where: { deleted: $deleted, userAddress: $userAddress }) {
      id
      userAddress
      days
      importance
      desc
      locationDescription
      deleted
    }
  }
`;

export const TAG_QUERIES = gql`
  query GetTags($userAddress: Bytes) {
    tags(where: { userAddress: $userAddress }) {
      id
      userAddress
      name
      summary
      importance
    }
  }
`;

export const DAILY_REMINDER_QUERIES = gql`
  query GetDailyReminder($userAddress: Bytes) {
    dailyReminders(where: { userAddress: $userAddress }) {
      id
      userAddress
      userName
      time
    }
  }
`;
