function formatDate(isoDate, format = "DD/MM/YYYY HH:mm") {
  const date = new Date(isoDate);

  // Helper to pad single-digit numbers
  const pad = (number) => (number < 10 ? `0${number}` : number);

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  if (format === "DD/MM/YYYY HH:mm") {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } else if (format === "MM/DD/YYYY HH:mm") {
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  return date.toLocaleString(); // Default to locale string if format not matched
}

export default formatDate;
