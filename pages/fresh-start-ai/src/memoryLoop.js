let lastUserMessage = '';
let repeatCount = 0;

export function handleMemoryLoop(userMessage) {
  const cleaned = userMessage.trim().toLowerCase();

  if (cleaned === lastUserMessage) {
    repeatCount++;
  } else {
    repeatCount = 0;
    lastUserMessage = cleaned;
  }

  if (repeatCount === 0) {
    return null; // normal response
  }

  if (repeatCount === 1) {
    return 'It\'s alright, I\'m here with you. You\'re safe.';
  }

  if (repeatCount === 2) {
    return 'Everything is okay. I can help you with that. You\'re not alone.';
  }

  if (repeatCount >= 3) {
    return 'You\'re safe, and I\'m right here with you. Let\'s take a slow breath together.';
  }

  return null;
}
