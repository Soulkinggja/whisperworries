import { useState, useEffect } from "react";

interface FriendCharacterProps {
  customColor?: string;
  selectedShape?: string;
  selectedFace?: string;
  isSpeaking?: boolean;
  characterName?: string;
}

export const FriendCharacter = ({
  customColor = "hsl(270, 65%, 65%)",
  selectedShape = "circle",
  selectedFace = "happy",
  isSpeaking = false,
  characterName = "",
}: FriendCharacterProps) => {
  const [blinkState, setBlinkState] = useState(false);
  const [idleAnimation, setIdleAnimation] = useState(0);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3000 + Math.random() * 2000); // Random blink every 3-5 seconds

    return () => clearInterval(blinkInterval);
  }, []);

  // Idle movement animation
  useEffect(() => {
    const idleInterval = setInterval(() => {
      setIdleAnimation((prev) => (prev + 1) % 3); // Cycle through 3 idle states
    }, 2000);

    return () => clearInterval(idleInterval);
  }, []);

  const getIdleTransform = () => {
    switch (idleAnimation) {
      case 0:
        return "translateY(0px) rotate(0deg)";
      case 1:
        return "translateY(-15px) rotate(2deg)";
      case 2:
        return "translateY(-8px) rotate(-1deg)";
      default:
        return "translateY(0px) rotate(0deg)";
    }
  };

  return (
    <div className="bg-card rounded-3xl p-12 shadow-[var(--shadow-soft)] flex flex-col items-center justify-center min-h-[400px] gap-6">
      {characterName && (
        <h2 className="text-2xl font-bold gradient-text animate-bounce">{characterName}</h2>
      )}
      <div
        className="relative flex flex-col items-center gap-1 transition-transform duration-500"
        style={{ transform: getIdleTransform() }}
      >
        {/* Head */}
        <div
          className={`w-24 h-24 transition-all duration-300 relative flex items-center justify-center`}
          style={{
            borderRadius:
              selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "12px" : "50%",
            backgroundColor: customColor,
            boxShadow: `0 0 20px ${customColor}60`,
          }}
        >
          {/* Face */}
          <div className="flex flex-col items-center gap-2">
            {/* Eyes with blinking */}
            <div className="flex gap-3">
              <div
                className="w-3 bg-foreground rounded-full transition-all duration-150"
                style={{
                  height: blinkState
                    ? "2px"
                    : selectedFace === "calm"
                    ? "2px"
                    : selectedFace === "angry"
                    ? "2px"
                    : "12px",
                  transform: selectedFace === "angry" ? "rotate(-20deg)" : "none",
                }}
              />
              <div
                className="w-3 bg-foreground rounded-full transition-all duration-150"
                style={{
                  height: blinkState
                    ? "2px"
                    : selectedFace === "calm"
                    ? "2px"
                    : selectedFace === "angry"
                    ? "2px"
                    : "12px",
                  transform: selectedFace === "angry" ? "rotate(20deg)" : "none",
                }}
              />
            </div>
            {/* Mouth */}
            <div
              className={`w-8 h-1 bg-foreground rounded-full transition-all duration-150 ${
                isSpeaking ? "animate-[mouth-talk_0.3s_ease-in-out_infinite]" : ""
              }`}
              style={{
                borderRadius:
                  selectedFace === "happy"
                    ? "0 0 100px 100px"
                    : selectedFace === "cheerful"
                    ? "0 0 100px 100px"
                    : selectedFace === "sad"
                    ? "100px 100px 0 0"
                    : selectedFace === "angry"
                    ? "0"
                    : selectedFace === "calm"
                    ? "100px"
                    : "100px",
                height:
                  selectedFace === "happy"
                    ? "8px"
                    : selectedFace === "cheerful"
                    ? "10px"
                    : selectedFace === "sad"
                    ? "6px"
                    : selectedFace === "angry"
                    ? "3px"
                    : "4px",
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div
          className={`w-28 h-32 transition-all duration-300 opacity-90`}
          style={{
            borderRadius:
              selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "12px" : "50%",
            backgroundColor: customColor,
            boxShadow: `0 4px 20px ${customColor}40`,
          }}
        />

        {/* Arms */}
        <div className="absolute top-[100px] flex gap-[120px]">
          <div
            className={`w-12 h-28 transition-all duration-300 opacity-85`}
            style={{
              borderRadius:
                selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "8px" : "50%",
              backgroundColor: customColor,
              boxShadow: `0 2px 12px ${customColor}30`,
            }}
          />
          <div
            className={`w-12 h-28 transition-all duration-300 opacity-85`}
            style={{
              borderRadius:
                selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "8px" : "50%",
              backgroundColor: customColor,
              boxShadow: `0 2px 12px ${customColor}30`,
            }}
          />
        </div>

        {/* Legs */}
        <div className="flex gap-2">
          <div
            className={`w-12 h-32 transition-all duration-300 opacity-85`}
            style={{
              borderRadius:
                selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "10px" : "50%",
              backgroundColor: customColor,
              boxShadow: `0 2px 12px ${customColor}30`,
            }}
          />
          <div
            className={`w-12 h-32 transition-all duration-300 opacity-85`}
            style={{
              borderRadius:
                selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "10px" : "50%",
              backgroundColor: customColor,
              boxShadow: `0 2px 12px ${customColor}30`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
