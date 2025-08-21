import { useMemo } from "react";

export function Options({ correctAnswer, incorrectAnswers, onAnswer, selectedAnswer, timeUp, questionId }) {
 
  const options = useMemo(() => {
    if (correctAnswer && incorrectAnswers) {
      const allOptions = [...incorrectAnswers, correctAnswer];
      
      return allOptions.sort(() => Math.random() - 0.5);
    }
    return [];
  }, [correctAnswer, incorrectAnswers, questionId]);

  const handleOptionClick = (option) => {
    if (!selectedAnswer && !timeUp) {
      onAnswer(option);
    }
  };

  const getOptionStyle = (option) => {
    if (!selectedAnswer && !timeUp) {
      return "bg-white/10 hover:bg-white/20 cursor-pointer";
    }
    
    if (timeUp && option === correctAnswer) {
      return "bg-emerald-500/30 border-2 border-emerald-500";
    }
    
    if (selectedAnswer === option) {
      if (option === correctAnswer) {
        return "bg-emerald-500/30 border-2 border-emerald-500";
      } else {
        return "bg-rose-500/30 border-2 border-rose-500";
      }
    }
    
    if (option === correctAnswer) {
      return "bg-emerald-500/30 border-2 border-emerald-500";
    }
    
    return "bg-white/5 cursor-not-allowed opacity-70";
  };

  const getOptionIcon = (option) => {
    if (timeUp && option === correctAnswer) {
      return "fas fa-check-circle text-emerald-400";
    }
    
    if (selectedAnswer === option) {
      if (option === correctAnswer) {
        return "fas fa-check-circle text-emerald-400";
      } else {
        return "fas fa-times-circle text-rose-400";
      }
    }
    
    if (option === correctAnswer && selectedAnswer) {
      return "fas fa-check-circle text-emerald-400";
    }
    
    return "far fa-circle";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => handleOptionClick(option)}
          className={`p-4 rounded-xl transition-all duration-300 ${getOptionStyle(option)}`}
        >
          <div className="flex items-center">
            <i className={`${getOptionIcon(option)} mr-3 text-lg`}></i>
            <span dangerouslySetInnerHTML={{ __html: option }} />
          </div>
        </div>
      ))}
    </div>
  );
}