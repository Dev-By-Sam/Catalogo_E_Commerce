export const useTextScramble = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  const scramble = (
    element: HTMLElement,
    finalText: string,
    speed: number = 25,
    onComplete?: () => void,
  ) => {
    let iteration = 0;
    const length = finalText.length;
    clearInterval((element as any)._scrambleInterval);

    (element as any)._scrambleInterval = setInterval(() => {
      element.innerText = finalText
        .split('')
        .map((letter, index) => {
          if (letter === ' ') return ' ';
          if (index < iteration) {
            return finalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= length) {
        clearInterval((element as any)._scrambleInterval);
        element.innerText = finalText;
        if (onComplete) onComplete();
      }

      iteration += 1 / 2;
    }, speed);
  };

  return {
    scramble,
  };
};
