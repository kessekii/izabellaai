import React, { useEffect } from "react";

export const scheduler_data = async ({
  stringValue,
  mode,
  taskFunction,
  props,
  i,
}) => {
  // Convert stringValue to a number
  const intervalValue = parseInt(stringValue, 10);
  console.log("intervalValue", intervalValue);
  // Validate the intervalValue and mode
  if (
    isNaN(intervalValue) ||
    (mode !== "hours" && mode !== "minutes" && mode !== "seconds")
  ) {
    console.error("Invalid interval value or mode.");
    return;
  }

  // Convert interval to milliseconds
  let intervalInMilliseconds;
  if (mode === "hours") {
    intervalInMilliseconds = intervalValue * 60 * 60 * 1000; // hours to milliseconds
  } else if (mode === "seconds") {
    intervalInMilliseconds = intervalValue * 1000; // seconds to milliseconds
  } else {
    intervalInMilliseconds = intervalValue * 60 * 1000; // minutes to milliseconds
  }
  console.log("finishing scheduler", intervalInMilliseconds);
  // Execute the taskFunction
  const answer = await taskFunction(props);

  return answer;
};

// Example usage:
// <Scheduler stringValue="5" mode="minutes" taskFunction={() => console.log('Task executed')} />
