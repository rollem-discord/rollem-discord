function minFormatter(formatted) {
  return "**" + formatted + "**";
}

function maxFormatter(formatted) {
  return "**" + formatted + "**";
}

function dropFormatter(formatted) {
  return "~~" + formatted + "~~";
}

// This is used to configure stylization of the individual die results.
export function dieFormatter(value, size, isKept = true) {
  let formatted = value
  if (value >= size)
    formatted = maxFormatter(formatted);
  else if (value === 1)
    formatted = minFormatter(formatted);

  if (!isKept)
    formatted = dropFormatter(formatted);

  return formatted;
}