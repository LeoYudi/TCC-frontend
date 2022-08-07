const addZero = number => (number >= 10 ? number : '0' + number);

const parseDate = string => {
  const date = new Date(string);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${addZero(day)}/${addZero(month)}/${year}`;
};

const parseHours = string => {
  const date = new Date(string);

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${addZero(hour)}h ${addZero(minute)}m ${addZero(second)}s`;
};

export { parseDate, parseHours };
