type SentenceProps = {
    sentence: string;
    selectedWords: string[];
    onBlankClick: (index: number) => void;
  };
  
  export const Sentence = ({ sentence, selectedWords, onBlankClick }: SentenceProps) => {
    const parts = sentence.split("___");
  
    return (
      <div className="text-xl mb-6 font-medium leading-relaxed break-words text-left">
        {parts.map((part, i) => (
          <span key={i} className="inline">
            {part}
            {i < selectedWords.length && (
              <button
                onClick={() => onBlankClick(i)}
                className="inline-block w-[120px] h-[30px] mx-1 bg-yellow-100 border-b-2 border-yellow-400 rounded cursor-pointer text-center text-base font-medium whitespace-nowrap overflow-hidden truncate"
              >
                {selectedWords[i] || "_____"}
              </button>
            )}
          </span>
        ))}
      </div>
    );
  };