const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return `${date.getDate()}/${date.getMonth() + 1}/${date
    .getFullYear()
    .toString()
    .slice(-2)}`;
};

// ✅ NEW ADVANCED FORMATTER
export const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = weekdays[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // 👇 Add ordinal (1st, 2nd, 3rd, etc.)
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${dayName}, ${month} ${day}${getOrdinal(day)}, ${year}`;
};

export default formatDate;
