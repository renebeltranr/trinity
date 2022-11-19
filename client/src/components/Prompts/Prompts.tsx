import { useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import './Prompts.css';
import ShareModal from '../ShareModal/ShareModal';

type PromptsProps = {
  prompt: string;
  promptArray: Prompt[];
  isChecking: boolean;
  setIsChecking: React.Dispatch<React.SetStateAction<boolean>>;
  inputs: any;
  guessCount: number;
};

type Prompt = {
  word: string;
  type: string;
};

function Prompts({
  prompt,
  promptArray,
  isChecking,
  setIsChecking,
  inputs,
  guessCount
}: PromptsProps) {
  const promptAsArray = prompt.split(' ');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isChecking) {
      console.log(inputs);
      const unknownPrompts = document.getElementsByClassName('unknown');
      for (let i = 0; i < promptArray.length; i++) {
        const inputValue = inputs[promptArray[i].type].toLowerCase();
        const promptValue = promptArray[i].word.toLowerCase();
        if (inputValue === promptValue) {
          const type = promptArray[i].type;
          let found;
          for (let i = 0; i < unknownPrompts.length; i++) {
            if (unknownPrompts[i].textContent === type) {
              found = unknownPrompts[i];
              break;
            }
          }
          if (found) {
            found.classList.remove('unknown');
            found.classList.add('known');
            found.textContent = promptArray[i].word;

            const input = document.getElementsByName(
              promptArray[i].type
            )[0] as any;
            input.disabled = true;
            input.value = promptArray[i].word;
            input.classList.remove('active');
          }
        }
      }

      // focus on first available input
      const firstInput = document.querySelector('.active') as HTMLInputElement;
      if (firstInput) firstInput.focus();

      if (guessCount === 5) {
        const unknownCopy = [...unknownPrompts];
        for (let i = 0; i < unknownCopy.length; i++) {
          unknownCopy[i].classList.add('wrong');
          unknownCopy[i].classList.remove('unknown');
          for (let j = 0; j < promptArray.length; j++) {
            if (unknownCopy[i].textContent === promptArray[j].type) {
              unknownCopy[i].textContent = promptArray[j].word;
            }
          }
        }
        setTimeout(() => {
          onOpen();
        }, 1000);
        const form = document.getElementById('prompt-form');
        if (form) form.style.display = 'none';
      }
      setIsChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecking]);

  return (
    <>
      <div className="prompts">
        <h1>
          {promptAsArray.map((word, index) => {
            if (!isNaN(+word)) {
              return (
                <span key={index} className="unknown">
                  {promptArray[+word].type}
                </span>
              );
            } else {
              return <span key={index}>{word} </span>;
            }
          })}
        </h1>
        <div className="guess-count">{guessCount} / 5 Guesses</div>
      </div>
      <ShareModal onClose={onClose} isOpen={isOpen} />
    </>
  );
}

export default Prompts;