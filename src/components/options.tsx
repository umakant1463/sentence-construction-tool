type OptionsProps = {
    options: string[];
    onSelect: (word: string) => void;
    usedWords: string[];
  };
  
  export const Options = ({ options, onSelect, usedWords }: OptionsProps) => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {options.map((word) => (
          <button
            key={word}
            onClick={() => onSelect(word)}
            disabled={usedWords.includes(word)}
            className={`px-4 py-2 rounded text-white font-semibold ${
              usedWords.includes(word)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {word}
          </button>
        ))}
      </div>
    );
  };
  