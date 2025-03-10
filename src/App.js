import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1a202c;
  background-image: linear-gradient(to bottom, #1a202c, #2d3748);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 1040px) {
    max-width: 100%;
    border-radius: 0;
    padding: 15px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  width: 100%;
  text-align: center;
`;

const MainTitle = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin: 0 0 20px 0;
  text-align: center;
  color: #ecc94b;
  width: 100%;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const SubTitle = styled.h2`
  font-size: 24px;
  color: #38b2ac; /* Teal color to differentiate from the gold title */
  margin: 5px 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-block;
`;

const PhaseText = styled.span`
  font-weight: 600;
`;

const Description = styled.p`
  color: #a0aec0;
  font-size: 16px;
  margin: 10px 0 0 0;
  text-align: center;
  max-width: 700px;
`;

const DaySelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 0 0 30px 0;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const DayControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const DayDisplay = styled.div`
  background-color: #2d3748;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  }
  
  @media (max-width: 480px) {
    padding: 10px 16px;
  }
`;

const DayText = styled.span`
  font-weight: bold;
  font-size: 18px;
  color: ${props => props.dim ? '#a0aec0' : 'white'};
`;

const DayNumber = styled.span`
  color: #ecc94b;
  font-size: 64px;
  font-weight: bold;
  line-height: 1;
  margin: 0 5px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  
  @media (max-width: 480px) {
    font-size: 48px;
  }
`;

const Button = styled.button`
  background-color: #4a5568;
  border: none;
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background-color: #2d3748;
    transform: translateY(-1px);
  }
  transition: all 0.2s ease;
`;

const GoButton = styled.button`
  background-color: #38b2ac;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #319795;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DayCompletionCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
  cursor: pointer;
`;

const Checkbox = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => (props.checked ? "#38b2ac" : "#2d3748")};
  border: 2px solid ${(props) => (props.checked ? "#38b2ac" : "#4a5568")};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #38b2ac;
    transform: scale(1.1);
  }
`;

const ProgressSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled.div`
  background-color: #2d3748;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.12);
  }
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const CardTitle = styled.h3`
  font-size: 16px;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const PhaseProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const PhaseInfo = styled.div`
  display: flex;
  align-items: center;
`;

const NextPhaseButton = styled.button`
  background-color: #4a5568;
  border: none;
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background-color: #2d3748;
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #2d3748;
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Progress = styled.div`
  height: 100%;
  background-color: #48bb78;
  width: ${(props) => props.percentage}%;
  border-radius: 4px;
  transition: width 0.5s ease-in-out;
`;

const ProgressText = styled.div`
  text-align: right;
  font-size: 12px;
  color: #a0aec0;
`;

const TabsContainer = styled.div`
  margin-top: 20px;
`;

const TabButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #2d3748;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    justify-content: center;
    gap: 8px;
  }
`;

const TabButton = styled.button`
  background-color: ${(props) => (props.active ? "#4a5568" : "transparent")};
  border: none;
  color: white;
  font-size: 14px;
  padding: 12px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  min-width: 90px;
  border-radius: 4px;
  
  &:hover {
    background-color: #4a5568;
  }
  
  @media (max-width: 768px) {
    min-width: 80px;
    flex: 0 0 auto;
  }
`;

const TabIcon = styled.div`
  font-size: 24px;
  margin-bottom: 6px;
`;

const TabLabel = styled.div`
  font-size: 13px;
  white-space: nowrap;
`;

const TabContent = styled.div`
  margin-top: 16px;
`;

const ScheduleItem = styled.div`
  display: flex;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 6px;
  background-color: ${props => props.isSupplementItem ? 'rgba(56, 178, 172, 0.15)' : 'transparent'};
  border-left: ${props => props.isSupplementItem ? '3px solid #38b2ac' : 'none'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isSupplementItem ? 'rgba(56, 178, 172, 0.25)' : 'rgba(74, 85, 104, 0.2)'};
  }
`;

const Time = styled.div`
  font-weight: bold;
  min-width: 100px;
  color: #ecc94b;
  
  @media (max-width: 480px) {
    min-width: 80px;
    font-size: 14px;
  }
`;

const Activity = styled.div`
  flex: 1;
  
  strong {
    color: #38b2ac;
    font-weight: bold;
  }
`;

const SectionTitle = styled.h3`
  font-size: 22px;
  color: #ecc94b;
  margin-top: 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Bullet = styled.span`
  color: #ecc94b;
  margin-right: 10px;
  flex-shrink: 0;
`;

const DetailsButton = styled.button`
  background-color: #4a5568;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  &:hover {
    background-color: #2d3748;
  }
`;

const DetailSection = styled.div`
  margin-top: 20px;
  border-top: 1px solid rgba(74, 85, 104, 0.5);
  padding-top: 20px;
`;

const CategoryTitle = styled.h4`
  font-size: 18px;
  color: #38b2ac;
  margin: 16px 0 8px 0;
  font-weight: 600;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #4a5568;
  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const ChecklistIcon = styled.div`
  margin-right: 12px;
  color: ${(props) => (props.checked ? "#10B981" : "#6B7280")};
  cursor: pointer;
`;

const ChecklistText = styled.div`
  flex-grow: 1;
  font-weight: ${(props) => (props.checked ? "normal" : "bold")};
  text-decoration: ${(props) => (props.checked ? "line-through" : "none")};
  color: ${(props) => (props.checked ? "#6B7280" : "white")};
`;

const ChecklistTime = styled.div`
  color: #ecc94b;
  font-size: 12px;
  margin-left: 8px;
`;

const VisualizationScript = styled.div`
  font-style: italic;
  background-color: rgba(56, 178, 172, 0.1);
  padding: 12px;
  border-radius: 6px;
  margin: 10px 0;
  line-height: 1.6;
  border-left: 3px solid #38b2ac;
`;

const ShoppingCategory = styled.div`
  margin-bottom: 24px;
  background-color: rgba(74, 85, 104, 0.1);
  padding: 16px;
  border-radius: 8px;
`;

const ShoppingItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  
  &:hover {
    color: #ecc94b;
  }
`;

const DayInput = styled.input`
  background-color: #1a202c;
  border: 1px solid #4a5568;
  border-radius: 4px;
  color: #ecc94b;
  width: 70px;
  padding: 10px 8px;
  margin: 0;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  
  /* Improve touch experience */
  -webkit-appearance: none;
  appearance: none;
  
  /* Remove spinner from number input */
  &::-webkit-inner-spin-button, 
  &::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
  
  @media (max-width: 480px) {
    width: 65px;
    padding: 12px 8px;
    font-size: 16px;
  }
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    justify-content: center;
  }
`;

function App() {
  // Initialize current day from localStorage or default to 31
  const [currentDay, setCurrentDay] = useState(() => {
    const savedDay = localStorage.getItem("tysonDashboardDay");
    return savedDay ? parseInt(savedDay) : 31;
  });

  // Initialize completed days from localStorage
  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem("tysonCompletedDays");
    return saved ? JSON.parse(saved) : {};
  });

  const [tempDay, setTempDay] = useState(currentDay);
  const [showDetails, setShowDetails] = useState({});
  const [checklist, setChecklist] = useState({});
  // Set the default active tab to "schedule" instead of "training"
  const [activeTab, setActiveTab] = useState("schedule");

  const totalDays = 90;

  // Save current day to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tysonDashboardDay", currentDay.toString());
  }, [currentDay]);

  // Save completed days to localStorage
  useEffect(() => {
    localStorage.setItem("tysonCompletedDays", JSON.stringify(completedDays));
  }, [completedDays]);

  // Function to toggle day completion
  const toggleDayCompletion = (day) => {
    setCompletedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Function to toggle showing details for a specific section
  const toggleDetails = (sectionId) => {
    setShowDetails((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Function to toggle checklist item completion
  const toggleChecklistItem = (itemId) => {
    setChecklist((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Handle input change for day jumping
  const handleDayInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setTempDay(value);
    }
  };

  // Handle jumping to a specific day
  const jumpToDay = () => {
    if (tempDay >= 1 && tempDay <= totalDays) {
      setCurrentDay(tempDay);
      setShowDetails({});
    }
  };

  // Handle key press for day input (allow Enter key to jump)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      jumpToDay();
    }
  };

  // Calculate which phase we're in based on the day
  const getPhaseFromDay = (day) => {
    if (day <= 30) return 1;
    if (day <= 60) return 2;
    return 3;
  };

  // Jump to next phase
  const jumpToNextPhase = () => {
    if (currentPhase < 3) {
      const nextPhaseStartDay = currentPhase === 1 ? 31 : 61;
      setCurrentDay(nextPhaseStartDay);
      setTempDay(nextPhaseStartDay);
      setShowDetails({});
    }
  };

  const currentPhase = getPhaseFromDay(currentDay);
  const nextPhase = currentPhase < 3 ? currentPhase + 1 : null;

  const phaseNames = {
    1: "DEMOLITION",
    2: "RECONSTRUCTION",
    3: "WEAPONIZATION",
  };

  const handleDayChange = (newDay) => {
    if (newDay >= 1 && newDay <= totalDays) {
      setCurrentDay(newDay);
      setTempDay(newDay);
      // Reset the details view when changing days
      setShowDetails({});
    }
  };

  const phaseInfo = {
    1: {
      name: "DEMOLITION",
      description: "Break down everything to rebuild stronger",
      color: "#e53e3e",
      progress: (currentDay / 30) * 100,
      maxDay: 30,
    },
    2: {
      name: "RECONSTRUCTION",
      description: "Build the physical weapons and fighting instincts",
      color: "#3182ce",
      progress: ((currentDay - 30) / 30) * 100,
      maxDay: 60,
    },
    3: {
      name: "WEAPONIZATION",
      description: "Refine and sharpen your physical and mental weapons",
      color: "#805ad5",
      progress: ((currentDay - 60) / 30) * 100,
      maxDay: 90,
    },
  };

  const getCurrentPhaseProgress = () => {
    if (currentPhase === 1) {
      return (currentDay / 30) * 100;
    } else if (currentPhase === 2) {
      return ((currentDay - 30) / 30) * 100;
    } else {
      return ((currentDay - 60) / 30) * 100;
    }
  };

  const getDailyNutritionPlan = () => {
    console.log("Getting nutrition plan for day:", currentDay, "phase:", currentPhase);
    
    if (currentPhase === 1) {
      if (currentDay <= 5) {
        return {
          title: "EXTREME CYCLICAL FASTING - Water Fast",
          description: "Strict water fast with electrolytes and specific supplements only",
          items: [
            "Morning: 1 tbsp apple cider vinegar + 1/4 tsp Himalayan salt in 16oz water",
            "Throughout day: 3-4 liters water with electrolytes (sodium, potassium, magnesium)",
            "Evening: 1 tbsp MCT oil to maintain minimal ketone production"
          ],
          details: [
            "Prepare 2 gallons of water each morning with electrolyte mix (1000mg sodium, 300mg potassium, 300mg magnesium per gallon)",
            "When hunger strikes: 1 cup warm water with 1/2 tsp Himalayan salt",
            "For energy crashes: Take 5 deep breaths, 10 pushups, then 1/2 tbsp MCT oil",
            "Brush teeth at noon and 8pm to reduce hunger signals",
            "If extreme fatigue: 1/4 tsp sea salt under tongue, wait 60 seconds before swallowing"
          ],
          mealPlan: "Complete fast - no solid foods for entire 5 days"
        };
      } else if (currentDay <= 10) {
        return {
          title: "EXTREME CYCLICAL FASTING - Snake Diet Protocol",
          description: "48-hour water fasts broken by 4-hour eating window",
          items: [
            "48-hour water fasts broken by 4-hour eating window",
            "Eating window meals: High protein (1.5g/lb lean mass), moderate fat, near-zero carb",
            "Supplements taken during eating window only"
          ],
          details: [
            "Fasting fluid mix: 2L water with 1 tsp sea salt, 1/2 tsp potassium chloride (Nu-Salt), 1/2 tsp food-grade magnesium sulfate",
            "Breaking fast properly: Start with bone broth 10 min before first solid food",
            "First solid meal: 6oz protein (salmon, beef, eggs) with 1 tbsp fat (olive oil, butter)",
            "Second meal (60 min later): 8oz protein, 2 cups non-starchy vegetables, 1-2 tbsp fat",
            "Supplement timing: All daily supplements taken with second meal"
          ],
          mealPlan: {
            refeeding: "Day " + currentDay + " is a " + (currentDay % 2 === 0 ? "FEEDING" : "FASTING") + " day",
            feedingWindow: "5:00 PM - 9:00 PM only",
            meals: [
              {
                time: "5:00 PM",
                food: "8oz bone broth with 1 tbsp grass-fed butter"
              },
              {
                time: "5:30 PM",
                food: "6-8oz grass-fed ribeye steak with pink salt and apple cider vinegar"
              },
              {
                time: "7:00 PM",
                food: "4 whole pasture-raised eggs with 2 cups sautéed spinach in coconut oil"
              },
              {
                time: "8:30 PM",
                food: "5oz wild salmon with 1 cup broccoli in grass-fed butter"
              }
            ]
          }
        };
      } else {
        // Days 11-30: Warrior Diet + Strategic Refeed
        return {
          title: "EXTREME CYCLICAL FASTING - Warrior Diet + Strategic Refeed",
          description: "20:4 fasting protocol (20 hours fasting, 4-hour evening eating window)",
          items: [
            "20:4 fasting protocol (20 hours fasting, 4-hour evening eating window)",
            "One strategic high-carb refeed day per week (300g complex carbs, post-training)",
            "All other days: High protein, moderate fat, low carb"
          ],
          details: [
            "During 20-hour fasting window: Water, black coffee, green tea only",
            "Pre-workout (fasted state): 1 tbsp MCT oil + 5g essential amino acids",
            "Breaking fast (post workout): 40g whey protein isolate, 10g glutamine",
            "Eating window strategy: Start with protein/fat, end with any carbs",
            "Refeed day strategy (Day " + (currentDay - currentDay % 7 + 6) + "): Front-load carbs in morning, taper through day"
          ],
          mealPlan: {
            refeedDay: currentDay % 7 === 6,
            meals: currentDay % 7 === 6 ? [
              {
                time: "6:00 AM",
                food: "2 cups white rice with cinnamon and 2 tbsp honey + 4 whole eggs"
              },
              {
                time: "9:00 AM",
                food: "1 large sweet potato, 6oz chicken breast, 1 tbsp olive oil"
              },
              {
                time: "12:00 PM",
                food: "8oz grass-fed beef, 1 cup white rice, 1 cup vegetables"
              },
              {
                time: "3:00 PM",
                food: "2 bananas, 40g whey protein, 1 tbsp almond butter"
              },
              {
                time: "6:00 PM",
                food: "8oz wild salmon, 1 cup quinoa, 2 cups mixed vegetables"
              }
            ] : [
              {
                time: "5:00 PM",
                food: "10oz grass-fed beef/wild-caught salmon/free-range chicken with 2 cups vegetables cooked in 2 tbsp fat (butter/tallow/coconut oil)"
              },
              {
                time: "7:00 PM",
                food: "3-5 whole eggs with 1/4 avocado and 2 cups leafy greens"
              },
              {
                time: "8:30 PM",
                food: "Protein shake: 40g protein with 1 tbsp MCT oil and 1 tbsp nut butter"
              }
            ]
          }
        };
      }
    } else if (currentPhase === 2) {
      // Phase 2: RECONSTRUCTION (DAYS 31-60)
      return {
        title: "METABOLIC FLEXIBILITY DEVELOPMENT",
        description: "Alternate Day Modified Fasting",
        items: [
          "36-hour fasts followed by 12-hour feeding windows",
          "On feeding days: 3000-3500 calories, high protein (250-300g), moderate carbs (150g), moderate fat",
          "On fasting days: Only water, electrolytes, coffee, and green tea"
        ],
        details: [
          "Fasting days: Structured electrolyte supplementation every 4 hours",
          "Pre-training (fasting day): 20g essential amino acids, 5g creatine, 200mg caffeine",
          "Post-training (fasting day): 30g protein isolate, no carbs, 5g BCAA",
          "Feeding day strategy: 4 meals, highest carbs post-workout, protein at every meal",
          "Nighttime recovery blend: Casein protein or collagen peptides with glycine (30g protein)"
        ],
        mealPlan: {
          feedingDay: currentDay % 2 === 0,
          meals: currentDay % 2 === 0 ? [
            {
              time: "6:00 AM",
              food: "6 whole eggs, 1 cup vegetables, 1 tbsp olive oil, 1/4 avocado"
            },
            {
              time: "Post-workout",
              food: "50g whey protein, 50g fast-digesting carbs (rice/potatoes), 5g creatine"
            },
            {
              time: "1:00 PM",
              food: "10oz lean protein (chicken/turkey/white fish), 1 cup rice, 2 cups vegetables"
            },
            {
              time: "6:00 PM",
              food: "10oz fatty protein (ribeye/salmon), 2 cups vegetables, 2 tbsp fat source"
            },
            {
              time: "Before bed",
              food: "30g casein protein or collagen peptides with glycine"
            }
          ] : [
            {
              time: "All day",
              food: "Water fast with scheduled electrolytes - Complete fasting protocol"
            },
            {
              time: "Pre-workout",
              food: "20g essential amino acids, 5g creatine, 200mg caffeine"
            },
            {
              time: "Post-workout",
              food: "30g protein isolate, 0g carbs, 5g BCAA"
            }
          ]
        }
      };
    } else {
      // Phase 3: WEAPONIZATION (DAYS 61-90)
      return {
        title: "PERFORMANCE OPTIMIZATION",
        description: "Targeted Ketogenic Diet pattern",
        items: [
          "Training days: 100-150g carbs consumed only in post-workout window",
          "Non-training days: Under 30g carbs, high protein, high fat",
          "One weekly carb-loading day (400-500g) for glycogen supercompensation"
        ],
        details: [
          "Daily intermittent fasting: 16/8 protocol (first meal at noon)",
          "Pre-training nutrition: 1 tbsp MCT oil, 10g EAAs, 5g creatine, 300mg caffeine",
          "Post-training window: 50g whey isolate + 50-60g dextrose + 5g creatine (training days only)",
          "Post-workout meal (within 90 minutes): 8oz protein, 100g carbs from white rice/potato",
          "Strategic carb loading: Day " + (currentDay - currentDay % 7 + 6) + " is high-carb (gradual increase throughout day)"
        ],
        mealPlan: {
          trainingDay: currentDay % 7 !== 0,
          carb_loadDay: currentDay % 7 === 6,
          meals: currentDay % 7 === 6 ? [
            { 
              time: "6:00 AM",
              food: "2 cups oatmeal, 2 bananas, 2 tbsp honey, 40g whey protein"
            },
            {
              time: "9:00 AM",
              food: "2 cups white rice, 8oz chicken breast, 1 cup vegetables"
            },
            {
              time: "12:00 PM",
              food: "2 large sweet potatoes, 8oz lean beef, 2 cups vegetables"
            },
            {
              time: "3:00 PM",
              food: "2 cups rice, 2 bananas, 40g whey protein"
            },
            {
              time: "6:00 PM",
              food: "12oz lean protein, 2 cups potatoes, 2 cups vegetables"
            },
            {
              time: "9:00 PM",
              food: "1 cup rice, 30g casein protein, 1 tbsp honey"
            }
          ] : currentDay % 7 !== 0 ? [
            {
              time: "12:00 PM",
              food: "6oz protein (eggs/salmon), 1/2 avocado, 2 cups vegetables"
            },
            {
              time: "Pre-workout",
              food: "10g EAAs, 5g creatine, 300mg caffeine, 1 tbsp MCT oil"
            },
            {
              time: "Post-workout",
              food: "50g whey isolate + 50g dextrose + 5g creatine"
            },
            {
              time: "Post-workout meal",
              food: "10oz lean protein, 100g carbs from white rice/potato, 2 cups vegetables"
            },
            {
              time: "Final meal",
              food: "8oz fatty protein, 2 cups green vegetables, 2 tbsp healthy fat"
            }
          ] : [
            {
              time: "12:00 PM",
              food: "6 whole eggs, 1/2 avocado, 2 cups spinach, 2 tbsp olive oil"
            },
            {
              time: "4:00 PM",
              food: "10oz fatty fish, 2 cups broccoli, 2 tbsp butter"
            },
            {
              time: "8:00 PM",
              food: "10oz ribeye steak, 2 cups asparagus, 1 tbsp butter, 1/2 avocado"
            }
          ]
        }
      };
    }
  };

  const getDailyTrainingPlan = () => {
    if (currentPhase === 1) {
      return {
        title: "PHASE 1: DEMOLITION - Foundation Building",
        description: "Break down everything to rebuild stronger while protecting the knee",
        items: [
          "Knee Rehab: Contrast therapy, BFR training",
          "Boxing: Shadow boxing with 1lb wrist weights",
          "Conditioning: Modified Tabata sprints, hill crawling",
          "Strength: Bodyweight circuits with isometric holds"
        ],
        details: {
          kneeRehab: [
            "Morning contrast therapy protocol: 3 minutes ice, 1 minute hot water, repeat 5x",
            "BFR (Blood Flow Restriction) therapy using DIY tourniquet at 70% occlusion",
            "Terminal knee extensions: 3 sets to failure with minimal weight",
            "Hamstring curls with towel on smooth surface: 4 sets to failure",
            "Evening: Red light therapy exposure (15-20 minutes) - can be DIY with proper bulbs"
          ],
          boxingTechnique: [
            "Shadow boxing with 1lb wrist weights: 10 rounds of 3 minutes (focus on form, not power)",
            "Neck strengthening: 4-way isometric neck holds, 30 seconds each direction, 5 sets",
            "Core stabilization: Hollow body holds, planks, side planks - accumulate 15 minutes daily",
            "Speed drill: 100 jabs as fast as possible with perfect form, 5 sets daily",
            "Focus on Tyson-style head movement: Pendulum sway + peek-a-boo guard"
          ],
          conditioning: [
            "Tabata sprints (modified for knee): Seated upper body only, 20s all-out/10s rest × 8",
            "Outdoor hill crawling: Bear crawl up inclines (protects knee while building endurance)",
            "Breath work: Wim Hof breathing followed by breath retention during bodyweight exercises",
            "Modified Tabata protocol: 20 seconds maximum effort, 10 seconds rest, 8 rounds"
          ],
          strength: [
            "Bodyweight training circuits:",
            "Push-up variations: standard, decline, diamond, archer (5 sets to failure)",
            "Pull-up progressions using door or tree (find anything to hang from)",
            "Single-leg exercises for uninjured leg to maintain balance",
            "Isometric holds in boxing positions: 60-second holds in various punch positions"
          ]
        },
        workoutSchedule: [
          { day: "Monday", focus: "Upper body power + boxing fundamentals" },
          { day: "Tuesday", focus: "Conditioning + knee rehab focus" },
          { day: "Wednesday", focus: "Active recovery + mobility" },
          { day: "Thursday", focus: "Core and rotational power + boxing technique" },
          { day: "Friday", focus: "Lower body (modified for knee) + conditioning" },
          { day: "Saturday", focus: "Full boxing integration workout" },
          { day: "Sunday", focus: "Complete rest + extended recovery protocols" }
        ]
      };
    } else if (currentPhase === 2) {
      return {
        title: "PHASE 2: RECONSTRUCTION - Power Development",
        description: "Build the physical weapons and fighting instincts",
        items: [
          "Knee Progress: Spanish Squat technique, single-leg balance",
          "Boxing: Focus on Tyson's peekaboo style and explosiveness",
          "Conditioning: Swimming, controlled stair sprints",
          "Strength: Isometric training in fight positions"
        ],
        details: {
          kneeRehab: [
            "Implement Spanish Squat technique (with support) to rebuild knee stability",
            "Single-leg balance work with progressive overload (eyes closed, unstable surfaces)",
            "Knee-friendly plyometrics: Controlled box step-ups with focus on perfect form",
            "Daily deep tissue work using lacrosse ball or DIY tools",
            "Controlled step-ups: 4 sets of 15 per leg using 4-6 inch platform"
          ],
          boxingTechnique: [
            "Shadow boxing progression: Now with 2-3lb weights, focus on combination development",
            "Speed bag simulation: Using rolled towels hanging from doorway or tree",
            "Reflex development: Have partner throw small objects for you to slip or parry",
            "Heavy bag substitute: Fill heavy-duty trash bags with sand/soil, hang from tree",
            "Focus on Mike Tyson's signature moves: Peekaboo defensive style, explosive inside fighting"
          ],
          conditioning: [
            "Roadwork alternative: Swimming with upper body only (if pool available)",
            "Stair/hill sprints with controlled descent to protect knee",
            "Medicine ball throws using homemade weighted ball (sand-filled basketball)",
            "Jump rope simulation without impact: Shadow jump rope focusing on footwork",
            "Interval training: 40s work / 20s rest for 15-20 minutes using knee-friendly movements"
          ],
          strength: [
            "Isometric training in fight-specific positions (30-60 second max tension holds)",
            "Accommodating resistance using bands or DIY equipment",
            "Partner-based resistance training (if available)",
            "Explosive medicine ball throws (homemade) for rotational power",
            "Rotational power: Medicine ball throws focusing on hip rotation and core engagement"
          ]
        },
        workoutSchedule: [
          { day: "Monday", focus: "Explosive power + advanced boxing technique" },
          { day: "Tuesday", focus: "Speed-endurance + footwork (modified)" },
          { day: "Wednesday", focus: "Strength focus + technical sparring" },
          { day: "Thursday", focus: "Active recovery + knee progression" },
          { day: "Friday", focus: "Conditioning + bag work alternatives" },
          { day: "Saturday", focus: "Fight simulation (full rounds)" },
          { day: "Sunday", focus: "Active recovery + mindset development" }
        ]
      };
    } else {
      return {
        title: "PHASE 3: WEAPONIZATION - Fighting Mastery",
        description: "Refine and sharpen your physical and mental weapons",
        items: [
          "Knee Finalization: Controlled jumping/landing mechanics",
          "Boxing: Perfect 3-5 signature combinations",
          "Conditioning: 12 rounds with 15-second breaks",
          "Power: Explosive movement patterns, resistance training"
        ],
        details: {
          kneeRehab: [
            "Progress to controlled jumping/landing mechanics",
            "Integration of lateral movement patterns specific to boxing",
            "Full Bulgarian split squat progression with bodyweight",
            "Implement kneesovertoesguy posterior chain protocol for bulletproofing",
            "Landing technique: Land through ball of foot → mid-foot → heel with knee tracking over toe"
          ],
          boxingTechnique: [
            "Combination refinement: Perfect 3-5 signature combinations with devastating power",
            "Timing drills: Partner throws objects of varying sizes and speeds to counter",
            "Speed-power contrast training: Ultra-fast shadowboxing followed by maximum power strikes",
            "Situational sparring (if partner available): Specific scenario training",
            "Strategy development: Study and implement Tyson's ring cutting and pressure techniques"
          ],
          conditioning: [
            "Sport-specific endurance: 12 rounds of shadowboxing with only 15-second breaks",
            "Anaerobic threshold training: Burpee variations modified for knee (60 seconds max effort, 60 seconds recovery, 10 rounds)",
            "Sledgehammer training using DIY implement (filled bag on rope)",
            "Isometric cardiovascular training: Horse stance while throwing combinations",
            "Championship endurance: 12 rounds of shadowboxing with only 15-second breaks"
          ],
          strength: [
            "Plyometric push-up variations (clap push-ups, uneven surface push-ups)",
            "Rotational medicine ball throws against wall with maximum velocity",
            "Resistance band punching with progressive tension",
            "Bulgarian bag training using homemade implement (sand-filled duffle wrapped in duct tape)",
            "Explosive hip hinge movements: Focus on posterior chain power development"
          ]
        },
        workoutSchedule: [
          { day: "Monday", focus: "Fight-specific power + advanced combinations" },
          { day: "Tuesday", focus: "Championship conditioning + technical refinement" },
          { day: "Wednesday", focus: "Active recovery + specific skill development" },
          { day: "Thursday", focus: "Explosive speed + timing work" },
          { day: "Friday", focus: "Strength maintenance + power endurance" },
          { day: "Saturday", focus: "Complete fight simulation (with audience if possible)" },
          { day: "Sunday", focus: "Strategic recovery + fight psychology" }
        ]
      };
    }
  };

  const getDailyMindsetPlan = () => {
    if (currentPhase === 1) {
      return {
        title: "PHASE 1: DEMOLITION - Psychological Foundation",
        description: "Breaking mental limitations and building the fighter's mindset",
        items: [
          "Morning: Cold exposure, visualization, affirmations",
          "Evening: Fear inventory practice, pain threshold extension",
          "Rage channeling meditation",
          "Identity reconstruction exercises"
        ],
        details: [
          "Cold exposure protocol: Start with 30 seconds, add 30 seconds daily up to 5 minutes maximum",
          "Visualization technique: See yourself moving with Tyson's speed, power, and confidence",
          "Affirmation structure: Record in your own voice, play back during morning routine",
          "Fear inventory process: Write down all fears about training/fighting, burn the paper afterward",
          "Pain threshold extension: Ice immersion of hands while maintaining focus and controlled breathing"
        ],
        visualizationScript: "Close your eyes. Breathe deeply. See yourself standing in the center of the ring. Feel the canvas under your feet. Notice the weight of your gloves, the wraps tight against your wrists. Your body feels powerful, coiled like a spring. Your muscles are dense, explosive. See yourself moving like Tyson - the subtle shifts of weight, the explosive power. Watch yourself slip a punch with ease, then unleash a devastating hook that connects perfectly. Feel the perfect transfer of energy from your legs, through your hips, into your shoulder and fist. Your opponent cannot match your intensity, your focus, your power. You are unstoppable. You are becoming a living weapon. Remember this feeling.",
        affirmations: [
          "I am rebuilding myself into a weapon",
          "My body responds instantly to my commands",
          "Pain is temporary, victory is forever",
          "I channel intensity into perfect execution",
          "My opponent feels fear when they see my confidence",
          "I am developing the mind and body of a champion fighter"
        ]
      };
    } else if (currentPhase === 2) {
      return {
        title: "PHASE 2: RECONSTRUCTION - Tyson Mentality Development",
        description: "Building the predator mindset of a fighter",
        items: [
          "Study and internalize Tyson interviews and training",
          "Fear inoculation through controlled exposure",
          "Contrast therapy extremes for mental toughness",
          "Strategic insomnia training once weekly"
        ],
        details: [
          "Tyson study protocol: Watch 30 minutes of fight footage daily, focusing on specific techniques",
          "Fear inoculation method: Progressively expose yourself to intimidating situations/people",
          "Contrast therapy extreme technique: Transition directly from ice bath to hottest bearable shower",
          "Insomnia training purpose: Once weekly all-night training session (improves stress resilience)",
          "Develop the predator mindset: Visualization of hunting opponents"
        ],
        visualizationScript: "Breathe deeply. Feel your heartbeat steady and strong. Now imagine yourself as a predator - powerful, patient, calculating. See yourself across from your opponent. Notice how they avoid your gaze, how they shift nervously. You feel no anxiety, only focused awareness. Your mind is clear, your body primed. You see their every movement in perfect clarity. Time seems to slow. You notice their weight shift slightly - telegraphing their intention before they even throw. Your response is automatic, devastating. Just like Tyson, you slip their punch and counter with perfect precision. Feel the raw power moving through your body. The perfect shot lands and you immediately reset, ready to attack again. This is not about emotion - this is about perfect execution. You are becoming the perfect fighting machine. Your opponent feels your predatory presence and begins to doubt themselves. You are in complete control.",
        affirmations: [
          "I am developing the mind of a champion",
          "I see everything in the ring with perfect clarity",
          "My opponents feel my predatory presence before I even move",
          "I remain calm when others panic",
          "I attack with controlled aggression and perfect timing",
          "My mind remains sharp under extreme pressure"
        ]
      };
    } else {
      return {
        title: "PHASE 3: WEAPONIZATION - Combat Psychology Mastery",
        description: "Becoming a psychological weapon in the ring",
        items: [
          "Intimidation aura development practice",
          "Mental triggers for instant aggression",
          "Fight outcome visualization with sensory richness",
          "Pre-fight ritual development and testing"
        ],
        details: [
          "Develop intimidation aura: Practice intense eye contact and dominant body language daily",
          "Mental triggers for instant aggression: Create specific words, movements or thoughts",
          "Visualization of successful fight outcomes with sensory richness",
          "Implementation of pre-fight ritual identical to what you'll use in actual competition",
          "Controlled aggression training: Channel emotional energy into technical execution"
        ],
        visualizationScript: "Close your eyes. Take three deep breaths. Now see yourself in the moments before your fight. Feel the energy in your body - not nervous energy, but focused power. See yourself performing your pre-fight ritual perfectly. Now you're entering the ring. Notice how the crowd reacts to your presence. You exude dangerous confidence. Your opponent can feel it. The bell rings. You move forward with controlled aggression, cutting off the ring just like Tyson. Your defensive shell is perfect. You slip a jab and counter with your signature combination - the one you've practiced thousands of times. It lands with devastating impact. You maintain perfect focus, never losing control. You see openings before they even appear. Your timing is supernatural. Every punch you throw has bad intentions, but your mind remains tactical. You are the perfect balance of explosive power and strategic thinking. See yourself dominating every exchange. Feel the moment of victory. The referee raising your hand. This outcome is inevitable if you execute your training perfectly.",
        affirmations: [
          "I am a complete fighter with unstoppable weapons",
          "My presence alone creates doubt in my opponents",
          "I fight with controlled fury and perfect technique",
          "I see openings before they appear",
          "My mind remains tactical even in the heat of battle",
          "I am becoming the fighter I was born to be"
        ]
      };
    }
  };

  const getDailySupplements = () => {
    const coreSupplements = [
      "Magnesium Glycinate: 400-600mg (divided doses)",
      "Vitamin D3: 5,000-10,000 IU with K2 (100mcg)",
      "Fish Oil: 3-5g EPA/DHA combined",
      "Creatine Monohydrate: 5g daily",
      "Zinc: 25-50mg (cycled 3 weeks on, 1 week off)",
      "Vitamin C: 1-3g daily (divided doses)",
      "NAC: 1200-1800mg daily (supports liver during intense training)"
    ];
    
    if (currentPhase === 1) {
      return {
        title: "PHASE 1: DEMOLITION - Foundation Supplements",
        items: [
          ...coreSupplements,
          "Electrolytes (crucial during fasting)",
          "CBD Oil: 50-100mg (anti-inflammatory)"
        ],
        details: {
          dosage: [
            "Magnesium Glycinate: 200mg morning, 200mg evening with food",
            "Vitamin D3: 5,000 IU with breakfast with K2 (100mcg)",
            "Fish Oil: 3g with first meal (higher EPA than DHA ratio)",
            "Creatine: 5g mixed in water, consistent timing daily",
            "Zinc: 25mg with dinner (not with calcium, separate from magnesium)",
            "Vitamin C: 500mg three times daily",
            "NAC: 600mg morning, 600mg evening",
            "Electrolytes: Sodium 3-5g, Potassium 1-2g, Magnesium 400mg throughout day",
            "CBD Oil: 50mg morning, 50mg evening (full spectrum if available)"
          ],
          timing: [
            "Morning: Vitamin D3/K2, Fish Oil, Creatine, NAC, Vitamin C, CBD Oil (first dose)",
            "Throughout day: Electrolytes in divided doses, Vitamin C",
            "Evening: Magnesium, Zinc (separate by 2 hours), NAC, Vitamin C, CBD Oil (second dose)"
          ],
          brandRecommendations: [
            "Magnesium: Doctor's Best High Absorption Magnesium",
            "Vitamin D3/K2: Thorne D3/K2 Liquid",
            "Fish Oil: Nordic Naturals Ultimate Omega",
            "Creatine: Creapure Creatine Monohydrate (any brand using this)",
            "Zinc: Thorne Zinc Picolinate",
            "Vitamin C: Pure Encapsulations Ascorbic Acid",
            "NAC: NOW NAC 600mg",
            "Electrolytes: LMNT or DIY mix (sodium, potassium chloride, magnesium)",
            "CBD: Charlotte's Web or Lazarus Naturals"
          ]
        }
      };
    } else if (currentPhase === 2) {
      return {
        title: "PHASE 2: RECONSTRUCTION - Performance Enhancers",
        items: [
          ...coreSupplements,
          "Beta-Alanine: 3-5g daily (split doses)",
          "Citrulline Malate: 8-10g pre-workout",
          "Betaine Anhydrous: 2.5g daily",
          "Cordyceps Sinensis: 3g daily",
          "Ashwagandha (KSM-66): 600mg twice daily"
        ],
        details: {
          dosage: [
            "Magnesium: Increase to 600mg total daily (300mg morning, 300mg evening)",
            "Vitamin D3: Maintain 5,000 IU with K2 (100mcg)",
            "Fish Oil: Increase to 4g daily with meals",
            "Creatine: Maintain 5g daily, consistent timing",
            "Zinc: Cycle 50mg for 3 weeks, 0mg for 1 week",
            "Vitamin C: Maintain 1-3g daily in divided doses",
            "NAC: Increase to 1800mg daily (600mg three times daily)",
            "Beta-Alanine: 2g morning, 2g afternoon (expect tingling sensation)",
            "Citrulline Malate: 8-10g 30 minutes before training",
            "Betaine Anhydrous: 1.25g morning, 1.25g evening",
            "Cordyceps: 1.5g morning, 1.5g evening",
            "Ashwagandha: 600mg morning, 600mg evening (KSM-66 extract)"
          ],
          timing: [
            "Morning: Vitamin D3/K2, Fish Oil (2g), Creatine, NAC, Beta-Alanine (first dose), Betaine (first dose), Cordyceps (first dose), Ashwagandha (first dose), Vitamin C",
            "Pre-workout: Citrulline Malate, remaining Beta-Alanine",
            "Post-workout: Fish Oil (remaining 2g), NAC (second dose), Vitamin C",
            "Evening: Magnesium, Zinc (on schedule), Ashwagandha (second dose), Betaine (second dose), Cordyceps (second dose), NAC (third dose), Vitamin C"
          ],
          brandRecommendations: [
            "Beta-Alanine: NOW Sports Beta-Alanine",
            "Citrulline Malate: BulkSupplements or Nutricost (2:1 ratio)",
            "Betaine Anhydrous: BulkSupplements or NOW Sports",
            "Cordyceps: Host Defense or Real Mushrooms",
            "Ashwagandha: Jarrow Formulas or Nootropics Depot KSM-66",
            "Continue high-quality brands for core supplements"
          ]
        }
      };
    } else {
      return {
        title: "PHASE 3: WEAPONIZATION - Peak Performance Stack",
        items: [
          ...coreSupplements,
          "Exogenous Ketones: 10-15g before training",
          "Tongkat Ali: 400mg daily (cycle 5 days on, 2 days off)",
          "Turkesterone: 500mg daily",
          "L-Carnitine L-Tartrate: 2-4g daily",
          "Tart Cherry Extract: 1500mg before bed"
        ],
        details: {
          dosage: [
            "Maintain all core supplements at Phase 2 levels",
            "Exogenous Ketones: 10-15g mixed in water 30 minutes pre-training",
            "Tongkat Ali: 400mg daily with breakfast (cycle 5 days on, 2 days off)",
            "Turkesterone: 500mg daily with food (morning meal)",
            "L-Carnitine L-Tartrate: 2g morning, 2g afternoon",
            "Tart Cherry Extract: 1500mg before bed (recovery)",
            "Add Glycine: 3g before bed (sleep quality)",
            "Add Apigenin: 50mg before bed (enhances deep sleep)"
          ],
          timing: [
            "Morning: Core supplements + Tongkat Ali + Turkesterone + L-Carnitine (first dose)",
            "Pre-workout: Exogenous Ketones, L-Carnitine (second dose)",
            "Evening: Remaining core supplements",
            "Before bed: Tart Cherry Extract, Glycine, Apigenin, Magnesium"
          ],
          brandRecommendations: [
            "Exogenous Ketones: Perfect Keto or KetoCaNa",
            "Tongkat Ali: Nootropics Depot or Double Wood",
            "Turkesterone: Gorilla Mind or Double Wood",
            "L-Carnitine L-Tartrate: NOW Sports or Nutricost",
            "Tart Cherry: Sports Research or Horbäach",
            "Glycine: BulkSupplements or NOW Foods",
            "Apigenin: Source Naturals or Double Wood"
          ]
        }
      };
    }
  };

  const getRecoveryProtocols = () => {
    if (currentPhase === 1) {
      return {
        title: "PHASE 1: DEMOLITION - Foundation Recovery",
        description: "Establish baseline recovery protocols",
        items: [
          "Contrast therapy: 3 min cold, 1 min hot x5",
          "Red light therapy for knee (15-20 min)",
          "Compression using DIY methods",
          "Sleep optimization: Temperature control, blackout"
        ],
        details: [
          "Contrast therapy exact protocol: Start with 3 min ice bath (50-60°F), immediately transition to 1 min hot shower (as hot as tolerable), repeat 5 cycles, always finish with cold",
          "DIY red light therapy: Use 660nm and 850nm LED bulbs positioned 6-12 inches from knee for 15-20 minutes daily",
          "Compression technique: Use Ace bandages for 30-60 minutes post-training with legs elevated",
          "Sleep optimization protocol: Bedroom at 60-65°F, complete blackout, no electronics 2 hours before bed",
          "Breath work technique: 4-7-8 breathing pattern before sleep (4 second inhale, 7 second hold, 8 second exhale)"
        ],
        implementation: [
          "Create contrast therapy setup: Large container with ice water + hot shower access",
          "Purchase 2-3 quality ice packs for knee therapy between contrast sessions",
          "Block all light sources in bedroom with blackout curtains or aluminum foil if needed",
          "Create sleep trigger routine: Same 3-4 actions performed in same order nightly",
          "Track sleep quality daily on 1-10 scale to measure improvement"
        ]
      };
    } else if (currentPhase === 2) {
      return {
        title: "PHASE 2: RECONSTRUCTION - Advanced Recovery",
        description: "Accelerate recovery between intense sessions",
        items: [
          "Extended contrast therapy protocols",
          "DIY percussion massage techniques",
          "Hyperbaric environment simulation",
          "Strategic liver support supplementation"
        ],
        details: [
          "Enhanced contrast therapy: Progress to 4 min cold (45-50°F) / 1 min hot / 8 cycles",
          "DIY percussion massage: Modified jigsaw with softball attachment (or tennis ball in sock)",
          "Target: 2-3 minutes per major muscle group, focus on fascia release",
          "Hyperbaric simulation: Wim Hof breathing (30 power breaths, retention, recovery breath), 3 rounds pre-sleep",
          "Liver support protocol: Milk thistle extract (1000mg) + dandelion root (1000mg) daily",
          "Nighttime recovery stack: Magnesium (400mg) + glycine (3g) + tart cherry extract (1000mg)"
        ],
        implementation: [
          "Create structured recovery sessions: 20-30 minutes dedicated solely to recovery work",
          "Schedule contrast therapy immediately post-training",
          "Position massage tools in training area for immediate access",
          "Create dedicated recovery space with necessary tools organized",
          "Recovery scorecard: Rate soreness 1-10 before/after recovery protocols"
        ]
      };
    } else {
      return {
        title: "PHASE 3: WEAPONIZATION - Elite Recovery",
        description: "Maximize recovery for peak performance",
        items: [
          "Comprehensive contrast therapy",
          "Advanced breath work for parasympathetic activation",
          "Strategic compression protocols",
          "Final sleep optimization techniques"
        ],
        details: [
          "Final contrast protocol: 5 min cold (40-45°F) / 1 min hot / 10 cycles with 1g vitamin C before session",
          "Parasympathetic activation: 4:8 breathing (4 second inhale, 8 second exhale) for 5 minutes post-training",
          "Advanced compression: Combination of elevation, compression bandages, and manual lymphatic drainage techniques",
          "Elite sleep protocol: Temperature regulation, complete darkness, white noise, mouth taping, weighted blanket",
          "CNS recovery technique: Alternate nostril breathing 10 minutes before bed"
        ],
        implementation: [
          "Prepare post-workout recovery kit: Timer, compression materials, breath work instructions",
          "Dedicate 45-60 minutes daily solely to recovery protocols",
          "Create ultimate sleep environment: Cool, dark, quiet, with backup solutions while traveling",
          "Develop pre-fight recovery timeline: Specific protocols for 3 days, 2 days, 1 day before fighting",
          "Travel recovery kit: Portable tools that maintain recovery quality when away from home"
        ]
      };
    }
  };

  const getWeeklyShoppingList = () => {
    if (currentPhase === 1) {
      if (currentDay <= 5) {
        return {
          supplements: [
            "Himalayan or sea salt (1 lb)",
            "Potassium chloride (No-Salt or Nu-Salt brand)",
            "Magnesium supplement (glycinate preferred)",
            "Apple cider vinegar (with the mother)",
            "MCT oil (1 bottle)",
            "Fish oil (high EPA formulation)",
            "Vitamin D3 with K2",
            "Vitamin C (powder or capsules)",
            "NAC (N-Acetyl Cysteine)",
            "CBD oil (if budget allows)"
          ],
          groceries: [
            "Filtered water (or water filter)",
            "Green tea (unsweetened)",
            "Fresh lemon (for morning water)",
            "Bone broth (for breaking fast later)"
          ],
          equipment: [
            "Multiple 1-gallon water containers",
            "Cold thermometer (to measure water temperature)",
            "Ice packs or bags of ice",
            "Kitchen scale for supplement measuring",
            "Journal for tracking fasting experience",
            "Red light therapy bulbs (660nm and 850nm)"
          ]
        };
      } else if (currentDay <= 10) {
        return {
          supplements: [
            "Himalayan or sea salt (1 lb)",
            "Potassium chloride (No-Salt or Nu-Salt brand)",
            "Magnesium supplement (glycinate preferred)",
            "Apple cider vinegar (with the mother)",
            "Core supplements: Fish oil, D3/K2, Zinc, Vitamin C, NAC",
            "Bone broth powder/cubes (for breaking fast)"
          ],
          groceries: [
            "Grass-fed beef (2-3 lbs)",
            "Wild-caught salmon (2 lbs)",
            "Pasture-raised eggs (2 dozen)",
            "Grass-fed butter or ghee",
            "Coconut oil (virgin, cold-pressed)",
            "Olive oil (extra virgin)",
            "Leafy greens (spinach, kale)",
            "Cruciferous vegetables (broccoli, cauliflower)",
            "Berries (small amount for refeed days)",
            "Avocados (2-3)"
          ],
          equipment: [
            "Food scale for precise protein measurement",
            "Meal preparation containers",
            "Timer for fasting windows",
            "Ice bath container or large tub",
            "Wrist weights (1lb) for shadow boxing"
          ]
        };
      } else {
        return {
          supplements: [
            "All core supplements: Magnesium, D3/K2, Fish Oil, Creatine, Zinc, Vitamin C, NAC",
            "Electrolyte materials (salt, potassium chloride, magnesium)",
            "Whey protein isolate (low carb)",
            "Essential amino acids (EAAs)",
            "MCT oil",
            "Glutamine powder",
            "CBD oil for recovery (optional)"
          ],
          groceries: [
            "Rotating protein sources: Grass-fed beef, wild salmon, free-range chicken (5-6 lbs total)",
            "Pasture-raised eggs (2-3 dozen)",
            "Organ meats (beef liver, heart - if tolerable)",
            "Healthy fats: Avocados, olives, coconut oil, olive oil",
            "Low-carb vegetables (5-6 different types, focusing on green vegetables)",
            "Berries (small amount)",
            "For refeed day: Sweet potatoes, white rice, bananas, honey"
          ],
          equipment: [
            "Foam roller for recovery",
            "Lacrosse ball for trigger point work",
            "Resistance bands for knee rehabilitation",
            "Wrist weights (1-2 lbs) for shadow boxing",
            "Materials for contrast therapy setup"
          ]
        };
      }
    } else if (currentPhase === 2) {
      return {
        supplements: [
          "Increased quantities of core supplements",
          "Beta-Alanine (200g container)",
          "Citrulline Malate (250g container)",
          "Betaine Anhydrous (100g container)",
          "Cordyceps Sinensis extract",
          "Ashwagandha (KSM-66 extract preferred)",
          "Whey protein isolate (5 lb container)",
          "Casein protein (for nighttime recovery)",
          "Tart cherry extract",
          "Electrolyte materials (salt, potassium chloride, magnesium)"
        ],
        groceries: [
          "Increased protein quantities (7-8 lbs total per week)",
          "Carbohydrate sources: White rice, sweet potatoes, potatoes",
          "Fruits: Berries, bananas (post-workout)",
          "Vegetables: Focus on variety and color (8-10 different types)",
          "Nuts and seeds (in moderation)",
          "Bone broth ingredients (for homemade)",
          "Coconut water (for post-training hydration)"
        ],
        equipment: [
          "Materials for DIY Bulgarian bag (duffel bag, sand/soil)",
          "Materials for homemade medicine ball",
          "Additional resistance bands of varying strengths",
          "Materials for contrast therapy setup improvements",
          "Percussion massage tool materials (attachment for jigsaw or equivalent)",
          "Heavier wrist weights (2-3 lbs)"
        ]
      };
    } else {
      return {
        supplements: [
          "Maintenance quantities of all previous supplements",
          "Exogenous ketones (BHB salts preferred)",
          "Tongkat Ali extract",
          "Turkesterone (if budget allows)",
          "L-Carnitine L-Tartrate",
          "Additional tart cherry extract",
          "Glycine powder",
          "Apigenin",
          "Glucose powder (for post-workout nutrition)",
          "Curcumin with piperine (for inflammation management)"
        ],
        groceries: [
          "Premium protein sources (focus on variety and quality)",
          "Carbohydrate timing specifics: White rice, potatoes, honey",
          "Strategic carb-loading foods for high-carb day",
          "Increased vegetable variety (10+ types weekly)",
          "Strategic fruit selection for specific training windows",
          "Bone broth ingredients for daily consumption",
          "Electrolyte-rich foods (coconut water, celery, etc.)"
        ],
        equipment: [
          "Materials for advanced recovery setup",
          "Sleep optimization gear: Blackout materials, cooling systems, mouth tape",
          "Final knee rehabilitation equipment needs",
          "DIY equipment maintenance/replacement materials",
          "Fight simulation materials (mouthguard, etc. if moving toward actual competition)",
          "Weighted blanket for sleep quality"
        ]
      };
    }
  };

  const getDailySchedule = () => {
    console.log("Getting schedule for day:", currentDay);
    const isTrainingDay = currentDay % 7 !== 0; // Assuming Sunday is rest day
    
    if (isTrainingDay) {
      // Training day schedule
      return [
        { time: "4:30 AM", activity: "Wake-up, 16oz water with Himalayan salt and lemon" },
        { time: "4:45 AM", activity: "Cold exposure immersion (shower or natural water)" },
        { time: "5:00 AM", activity: "Mindset work (20 min visualization, affirmations)" },
        { time: "5:30 AM", activity: "Mobility/activation routine (20 minutes)" },
        { time: "5:50 AM", activity: "Knee rehabilitation protocol" },
        { time: "6:00 AM", activity: "Conditioning workout (varies by day)" },
        { time: "7:00 AM", activity: "Ice bath recovery" },
        { time: "7:30 AM", activity: currentDay <= 10 ? "Electrolytes + supplements" : "First meal prep (if feeding window)" },
        { time: "8:00 AM", activity: "Study fighting technique (videos, books)" },
        { time: "11:00 AM", activity: "Specific skill training (shadow boxing focus)" },
        { time: "12:30 PM", activity: "Technical development (60-90 minutes)" },
        { time: "1:00 PM", activity: "Recovery protocols (contrast therapy, compression)" },
        { time: "2:00 PM", activity: "Meditation and visualization" },
        { time: "3:00 PM", activity: "Main strength training session" },
        { time: "4:00 PM", activity: "Explosive power development" },
        { time: "5:00 PM", activity: "Final boxing session (combination work, timing)" },
        { time: "6:00 PM", activity: "Mental warfare training" },
        { time: "7:00 PM", activity: currentDay <= 10 ? "Recovery supplementation" : "Strategic nutrition (if feeding window)" },
        { time: "8:00 PM", activity: "Final knee rehab session" },
        { time: "9:00 PM", activity: "Contrast therapy" },
        { time: "9:30 PM", activity: "Sleep preparation protocol" },
        { time: "10:00 PM", activity: "Final mindset programming" },
        { time: "10:30 PM", activity: "Sleep" }
      ];
    } else {
      // Rest day schedule
      return [
        { time: "5:00 AM", activity: "Wake-up (extra 30 min sleep)" },
        { time: "5:15 AM", activity: "Cold exposure (shorter duration)" },
        { time: "5:30 AM", activity: "Extended mindset work (40 minutes)" },
        { time: "6:00 AM", activity: "Extended mobility session" },
        { time: "6:30 AM", activity: "Injury prevention focus" },
        { time: "7:00 AM", activity: "Light active recovery" },
        { time: "8:00 AM", activity: currentDay <= 10 ? "Electrolytes + supplements" : "Breakfast (if feeding window)" },
        { time: "9:00 AM", activity: "Technique study (videos, books)" },
        { time: "10:00 AM", activity: "Mental training & visualization (extended session)" },
        { time: "12:00 PM", activity: "Light skill practice & balance work" },
        { time: "1:00 PM", activity: currentDay <= 10 ? "Electrolytes + supplements" : "Lunch (if feeding window)" },
        { time: "2:00 PM", activity: "Recovery modalities & contrast therapy" },
        { time: "3:00 PM", activity: "Study fighting footage & strategy development" },
        { time: "5:00 PM", activity: "Light movement & mobility flow" },
        { time: "6:00 PM", activity: "Visualization practice (fight scenarios)" },
        { time: "7:00 PM", activity: currentDay <= 10 ? "Recovery supplementation" : "Strategic nutrition & supplementation" },
        { time: "8:00 PM", activity: "Final recovery protocols" },
        { time: "9:00 PM", activity: "Sleep preparation & relaxation techniques" },
        { time: "10:00 PM", activity: "Sleep" }
      ];
    }
  };

  const getDailyChecklist = () => {
    const isTrainingDay = currentDay % 7 !== 0;
    const isPhase1Water = currentPhase === 1 && currentDay <= 5;
    const isPhase1Snake = currentPhase === 1 && currentDay > 5 && currentDay <= 10;
    
    const commonItems = [
      { id: "morning_mindset", text: "Morning mindset protocol completed", time: "5:00-5:30 AM" },
      { id: "cold_exposure", text: "Cold exposure protocol", time: "4:45-5:00 AM" },
      { id: "knee_rehab_am", text: "Morning knee rehabilitation protocol", time: "5:50-6:00 AM" },
      { id: "hydration_electrolytes", text: "Hydration & electrolytes (minimum 1 gallon)", time: "Throughout day" },
      { id: "supplements_am", text: "Morning supplements taken", time: "7:30 AM" },
      { id: "recovery_protocols", text: "Recovery protocols completed", time: "Variable" },
      { id: "evening_mindset", text: "Evening mindset & visualization", time: "10:00 PM" },
      { id: "sleep_optimization", text: "Sleep optimization setup", time: "9:30 PM" }
    ];
    
    const trainingDayItems = [
      { id: "conditioning_workout", text: "Conditioning workout completed", time: "6:00-7:00 AM" },
      { id: "ice_bath", text: "Post-workout ice bath", time: "7:00-7:30 AM" },
      { id: "technical_training", text: "Boxing technique session completed", time: "11:00-12:30 PM" },
      { id: "meditation", text: "Meditation and visualization", time: "2:00-2:30 PM" },
      { id: "main_strength", text: "Main strength & power session", time: "3:00-4:30 PM" },
      { id: "evening_boxing", text: "Evening boxing & mental warfare training", time: "5:00-6:30 PM" },
      { id: "knee_rehab_pm", text: "Evening knee rehabilitation", time: "8:00-8:30 PM" },
      { id: "contrast_therapy", text: "Contrast therapy completed", time: "9:00-9:30 PM" }
    ];
    
    const restDayItems = [
      { id: "extended_mindset", text: "Extended mindset work completed", time: "5:30-6:00 AM" },
      { id: "extended_mobility", text: "Extended mobility session completed", time: "6:00-6:30 AM" },
      { id: "injury_prevention", text: "Injury prevention work", time: "6:30-7:00 AM" },
      { id: "active_recovery", text: "Light active recovery work", time: "7:00-7:30 AM" },
      { id: "technique_study", text: "Technique study session", time: "9:00-10:00 AM" },
      { id: "mental_training", text: "Deep mental training & visualization", time: "10:00-11:00 AM" },
      { id: "contrast_therapy", text: "Complete contrast therapy session", time: "2:00-3:00 PM" },
      { id: "fight_study", text: "Study Tyson footage & strategy development", time: "3:00-4:00 PM" },
      { id: "light_skill", text: "Light skill practice", time: "5:00-6:00 PM" }
    ];
    
    // Nutrition items based on phase and day
    let nutritionItems = [];
    
    if (isPhase1Water) {
      nutritionItems = [
        { id: "morning_acv", text: "Morning ACV + salt water", time: "4:30 AM" },
        { id: "electrolyte_doses", text: "4 scheduled electrolyte doses", time: "Every 4 hours" },
        { id: "evening_mct", text: "Evening MCT oil dose", time: "7:00 PM" }
      ];
    } else if (isPhase1Snake) {
      const isFeedingDay = currentDay % 2 === 0;
      if (isFeedingDay) {
        nutritionItems = [
          { id: "bone_broth", text: "Breaking fast with bone broth", time: "5:00 PM" },
          { id: "meal_1", text: "First protein-focused meal", time: "5:30 PM" },
          { id: "meal_2", text: "Second complete meal", time: "7:00 PM" },
          { id: "final_meal", text: "Final nutritional intake", time: "8:30 PM" }
        ];
      } else {
        nutritionItems = [
          { id: "fasting_protocol", text: "Complete fasting (water + electrolytes only)", time: "All day" },
          { id: "electrolyte_doses", text: "Scheduled electrolyte doses", time: "Every 4 hours" }
        ];
      }
    } else if (currentPhase === 1) {
      // Phase 1 Warrior Diet (days 11-30)
      const isRefeedDay = currentDay % 7 === 6;
      if (isRefeedDay) {
        nutritionItems = [
          { id: "carb_refeed_1", text: "Morning carb meal with protein", time: "6:00 AM" },
          { id: "carb_refeed_2", text: "Mid-morning carb + protein meal", time: "9:00 AM" },
          { id: "carb_refeed_3", text: "Lunch with carbs, protein, vegetables", time: "12:00 PM" },
          { id: "carb_refeed_4", text: "Afternoon protein + carb snack", time: "3:00 PM" },
          { id: "carb_refeed_5", text: "Evening balanced meal", time: "6:00 PM" }
        ];
      } else {
        nutritionItems = [
          { id: "fasting_window", text: "20-hour fasting window maintained", time: "Until 5:00 PM" },
          { id: "pre_workout", text: "Pre-workout supplements (if training)", time: "Before training" },
          { id: "post_workout", text: "Post-workout protein", time: "After training" },
          { id: "evening_meal_1", text: "First evening meal (protein/fat focused)", time: "5:00 PM" },
          { id: "evening_meal_2", text: "Second evening meal", time: "7:00 PM" },
          { id: "final_meal", text: "Final protein intake", time: "8:30 PM" }
        ];
      }
    } else if (currentPhase === 2) {
      // Phase 2 Alternate Day Modified Fasting
      const isFeedingDay = currentDay % 2 === 0;
      if (isFeedingDay) {
        nutritionItems = [
          { id: "breakfast", text: "Morning protein + fat meal", time: "6:00 AM" },
          { id: "post_workout", text: "Post-workout nutrition", time: "After training" },
          { id: "lunch", text: "Midday balanced meal", time: "1:00 PM" },
          { id: "dinner", text: "Evening protein-focused meal", time: "6:00 PM" },
          { id: "night_protein", text: "Nighttime recovery protein", time: "Before bed" }
        ];
      } else {
        nutritionItems = [
          { id: "fasting_protocol", text: "36-hour fast maintained", time: "All day" },
          { id: "electrolytes", text: "Scheduled electrolyte intake", time: "Every 4 hours" },
          { id: "pre_workout", text: "Pre-workout aminos + caffeine", time: "Before training" },
          { id: "post_workout", text: "Post-workout protein (no carbs)", time: "After training" }
        ];
      }
    } else {
      // Phase 3 Targeted Ketogenic Diet
      const isCarb_loadDay = currentDay % 7 === 6;
      const isTrainingDay = currentDay % 7 !== 0;
      
      if (isCarb_loadDay) {
        nutritionItems = [
          { id: "carb_load_1", text: "Morning carb-loading meal", time: "6:00 AM" },
          { id: "carb_load_2", text: "Mid-morning carb + protein", time: "9:00 AM" },
          { id: "carb_load_3", text: "Lunch with high-quality carbs", time: "12:00 PM" },
          { id: "carb_load_4", text: "Afternoon carb + protein", time: "3:00 PM" },
          { id: "carb_load_5", text: "Evening balanced meal", time: "6:00 PM" },
          { id: "carb_load_6", text: "Final carb + protein intake", time: "9:00 PM" }
        ];
      } else if (isTrainingDay) {
        nutritionItems = [
          { id: "fasting_window", text: "16-hour fast maintained", time: "Until 12:00 PM" },
          { id: "first_meal", text: "First meal (protein + fat)", time: "12:00 PM" },
          { id: "pre_workout", text: "Pre-workout nutrition", time: "Before training" },
          { id: "post_workout", text: "Post-workout protein + carbs", time: "After training" },
          { id: "post_workout_meal", text: "Post-workout complete meal", time: "Within 90 min" },
          { id: "final_meal", text: "Final protein + fat meal", time: "Evening" }
        ];
      } else {
        nutritionItems = [
          { id: "fasting_window", text: "16-hour fast maintained", time: "Until 12:00 PM" },
          { id: "low_carb_meal_1", text: "First low-carb meal", time: "12:00 PM" },
          { id: "low_carb_meal_2", text: "Second low-carb meal", time: "4:00 PM" },
          { id: "low_carb_meal_3", text: "Final low-carb meal", time: "8:00 PM" }
        ];
      }
    }
    
    // Biometric tracking items
    const biometricItems = [
      { id: "morning_weight", text: "Morning weight recorded", time: "Upon waking" },
      { id: "resting_hr", text: "Resting heart rate measured", time: "Upon waking" },
      { id: "sleep_quality", text: "Sleep quality score recorded (1-10)", time: "Upon waking" },
      { id: "knee_pain", text: "Knee pain/function score recorded (1-10)", time: "Upon waking" },
      { id: "readiness", text: "Subjective readiness score recorded (1-10)", time: "Upon waking" }
    ];
    
    return [
      ...commonItems,
      ...(isTrainingDay ? trainingDayItems : restDayItems),
      ...nutritionItems,
      ...biometricItems
    ];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "schedule":
        return (
          <Card key={`schedule-day-${currentDay}`}>
            <CardHeader>
              <CardTitle>Day {currentDay} Schedule</CardTitle>
              <Description>
                {currentDay % 7 === 0 ? "REST DAY" : "TRAINING DAY"} Schedule for Phase {currentPhase}
              </Description>
            </CardHeader>
            {getDailySchedule().map((item, index) => (
              <ScheduleItem 
                key={index} 
                isSupplementItem={item.activity.toLowerCase().includes('supplement') || 
                                 item.activity.toLowerCase().includes('vitamin') ||
                                 item.activity.toLowerCase().includes('protein') ||
                                 item.activity.toLowerCase().includes('creatine')}
              >
                <Time>{item.time}</Time>
                <Activity dangerouslySetInnerHTML={{ 
                  __html: item.activity.replace(/(supplement|vitamin|protein|creatine|bcaa|enzyme|electrolyte|magnesium|zinc|ashwagandha|zma|beta-alanine|caffeine|fish oil|multivitamin|citrulline)/gi, 
                  match => `<strong>${match}</strong>`) 
                }} />
              </ScheduleItem>
            ))}
          </Card>
        );
      case "training":
        const trainingPlan = getDailyTrainingPlan();
        return (
          <Card>
            <CardHeader>
              <CardTitle>Training Plan</CardTitle>
              <Description>{trainingPlan.description}</Description>
            </CardHeader>
            <SectionTitle>{trainingPlan.title}</SectionTitle>
            <List>
              {trainingPlan.items.map((item, index) => (
                <ListItem key={index}>
                  <Bullet>•</Bullet>
                  {item}
                </ListItem>
              ))}
            </List>

            <DetailSection>
              <CategoryTitle>Knee Rehabilitation</CategoryTitle>
              <List>
                {trainingPlan.details.kneeRehab.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ListItem>
                ))}
              </List>

              <CategoryTitle>Boxing Technique Development</CategoryTitle>
              <List>
                {trainingPlan.details.boxingTechnique.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ListItem>
                ))}
              </List>

              <CategoryTitle>Conditioning Protocol</CategoryTitle>
              <List>
                {trainingPlan.details.conditioning.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ListItem>
                ))}
              </List>

              <CategoryTitle>Strength Development</CategoryTitle>
              <List>
                {trainingPlan.details.strength.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ListItem>
                ))}
              </List>

              <CategoryTitle>Weekly Workout Schedule</CategoryTitle>
              <List>
                {trainingPlan.workoutSchedule.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    <strong>{item.day}:</strong> {item.focus}
                  </ListItem>
                ))}
              </List>
            </DetailSection>
          </Card>
        );
      case "nutrition":
        const nutritionPlan = getDailyNutritionPlan();
        return (
          <Card key={`nutrition-day-${currentDay}`}>
            <CardHeader>
              <CardTitle>Nutrition Protocol</CardTitle>
              <Description>{nutritionPlan.description}</Description>
            </CardHeader>
            <SectionTitle>{nutritionPlan.title}</SectionTitle>
            <List>
              {nutritionPlan.items.map((item, index) => (
                <ListItem key={index}>
                  <Bullet>•</Bullet>
                  {item}
                </ListItem>
              ))}
            </List>

            <DetailSection>
              <CategoryTitle>Implementation Details</CategoryTitle>
              <List>
                {nutritionPlan.details.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ListItem>
                ))}
              </List>

              <CategoryTitle>Daily Meal Plan</CategoryTitle>
              {typeof nutritionPlan.mealPlan === "string" ? (
                <p>{nutritionPlan.mealPlan}</p>
              ) : (
                <>
                  {nutritionPlan.mealPlan.refeedDay !== undefined && (
                    <p>
                      <strong>
                        {nutritionPlan.mealPlan.refeedDay
                          ? "REFEED DAY"
                          : "REGULAR DAY"}
                      </strong>
                    </p>
                  )}
                  {nutritionPlan.mealPlan.feedingDay !== undefined && (
                    <p>
                      <strong>
                        {nutritionPlan.mealPlan.feedingDay
                          ? "FEEDING DAY"
                          : "FASTING DAY"}
                      </strong>
                    </p>
                  )}
                  {nutritionPlan.mealPlan.refeeding !== undefined && (
                    <p>
                      <strong>{nutritionPlan.mealPlan.refeeding}</strong> -{" "}
                      {nutritionPlan.mealPlan.feedingWindow}
                    </p>
                  )}
                  {nutritionPlan.mealPlan.trainingDay !== undefined && (
                    <p>
                      <strong>
                        {nutritionPlan.mealPlan.trainingDay
                          ? "TRAINING DAY NUTRITION"
                          : "REST DAY NUTRITION"}
                      </strong>
                    </p>
                  )}
                  {nutritionPlan.mealPlan.meals && (
                    <List>
                      {nutritionPlan.mealPlan.meals.map((meal, index) => (
                        <ListItem key={index}>
                          <Bullet>•</Bullet>
                          <strong>{meal.time}:</strong> {meal.food}
                        </ListItem>
                      ))}
                    </List>
                  )}
                </>
              )}
            </DetailSection>
          </Card>
        );
      case "mindset":
        const mindsetPlan = getDailyMindsetPlan();
        return (
          <Card>
            <CardHeader>
              <CardTitle>Mindset Programming</CardTitle>
              <Description>{mindsetPlan.description}</Description>
            </CardHeader>
            <SectionTitle>{mindsetPlan.title}</SectionTitle>
            <List>
              {mindsetPlan.items.map((item, index) => (
                <ListItem key={index}>
                  <Bullet>•</Bullet>
                  {item}
                </ListItem>
              ))}
            </List>

            <DetailSection>
              <CategoryTitle>Implementation Steps</CategoryTitle>
              <List>
                {mindsetPlan.details.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ListItem>
                ))}
              </List>

              <CategoryTitle>Daily Visualization Script</CategoryTitle>
              <VisualizationScript>
                {mindsetPlan.visualizationScript}
              </VisualizationScript>

              <CategoryTitle>Daily Affirmations</CategoryTitle>
              <List>
                {mindsetPlan.affirmations.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>"{item}"
                  </ListItem>
                ))}
              </List>
            </DetailSection>
          </Card>
        );
      case "supplements":
        const supplementPlan = getDailySupplements();
        return (
          <Card>
            <CardHeader>
              <CardTitle>Supplement Protocol</CardTitle>
              <Description>
                Phase {currentPhase} optimized supplementation
              </Description>
            </CardHeader>
            <SectionTitle>{supplementPlan.title}</SectionTitle>
            <List>
              {supplementPlan.items.map((item, index) => (
                <ListItem key={index}>
                  <Bullet>•</Bullet>
                  {item}
                </ListItem>
              ))}
            </List>

            <DetailSection>
              <CategoryTitle>Exact Dosages</CategoryTitle>
              <List>
                {supplementPlan.details.dosage.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ListItem>
                ))}
              </List>

              <CategoryTitle>Timing Strategy</CategoryTitle>
              <List>
                {supplementPlan.details.timing.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ListItem>
                ))}
              </List>

              <CategoryTitle>Recommended Brands</CategoryTitle>
              <List>
                {supplementPlan.details.brandRecommendations.map(
                  (item, index) => (
                    <ListItem key={index}>
                      <Bullet>•</Bullet>
                      {item}
                    </ListItem>
                  )
                )}
              </List>
            </DetailSection>
          </Card>
        );
      case "recovery":
        const recoveryPlan = getRecoveryProtocols();
        return (
          <Card>
            <CardHeader>
              <CardTitle>Recovery Protocols</CardTitle>
              <Description>{recoveryPlan.description}</Description>
            </CardHeader>
            <SectionTitle>{recoveryPlan.title}</SectionTitle>
            <List>
              {recoveryPlan.items.map((item, index) => (
                <ListItem key={index}>
                  <Bullet>•</Bullet>
                  {item}
                </ListItem>
              ))}
            </List>

            <DetailSection>
              <CategoryTitle>Detailed Protocol</CategoryTitle>
              <List>
                {recoveryPlan.details.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ListItem>
                ))}
              </List>

              <CategoryTitle>Implementation Steps</CategoryTitle>
              <List>
                {recoveryPlan.implementation.map((item, index) => (
                  <ListItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ListItem>
                ))}
              </List>
            </DetailSection>
          </Card>
        );
      case "shopping":
        const shoppingList = getWeeklyShoppingList();
        return (
          <Card>
            <CardHeader>
              <CardTitle>Shopping List</CardTitle>
              <Description>
                Week {Math.ceil(currentDay / 7)} essentials for Phase{" "}
                {currentPhase}
              </Description>
            </CardHeader>

            <ShoppingCategory>
              <CategoryTitle>Supplements</CategoryTitle>
              <List>
                {shoppingList.supplements.map((item, index) => (
                  <ShoppingItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ShoppingItem>
                ))}
              </List>
            </ShoppingCategory>

            <ShoppingCategory>
              <CategoryTitle>Groceries</CategoryTitle>
              <List>
                {shoppingList.groceries.map((item, index) => (
                  <ShoppingItem key={index}>
                    <Bullet>•</Bullet>
                    {item}
                  </ShoppingItem>
                ))}
              </List>
            </ShoppingCategory>

            {shoppingList.equipment && (
              <ShoppingCategory>
                <CategoryTitle>Equipment</CategoryTitle>
                <List>
                  {shoppingList.equipment.map((item, index) => (
                    <ShoppingItem key={index}>
                      <Bullet>•</Bullet>
                      {item}
                    </ShoppingItem>
                  ))}
                </List>
              </ShoppingCategory>
            )}
          </Card>
        );
      case "checklist":
        const checklistItems = getDailyChecklist();
        return (
          <Card>
            <CardHeader>
              <CardTitle>Day {currentDay} Checklist</CardTitle>
              <Description>
                Track your daily completion for maximum results
              </Description>
            </CardHeader>

            {checklistItems.map((item, index) => (
              <ChecklistItem key={index}>
                <ChecklistIcon
                  checked={checklist[item.id]}
                  onClick={() => toggleChecklistItem(item.id)}
                >
                  {checklist[item.id] ? "✓" : "○"}
                </ChecklistIcon>
                <ChecklistText checked={checklist[item.id]}>
                  {item.text}
                </ChecklistText>
                <ChecklistTime>{item.time}</ChecklistTime>
              </ChecklistItem>
            ))}

            <DetailsButton
              onClick={() => {
                // Reset all checklist items
                const newChecklist = {};
                checklistItems.forEach((item) => {
                  newChecklist[item.id] = false;
                });
                setChecklist(newChecklist);
              }}
              style={{ backgroundColor: "#e53e3e", marginTop: "20px" }}
            >
              Reset Checklist
            </DetailsButton>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <MainTitle>90-DAY TYSON TRANSFORMATION</MainTitle>
        <SubTitle>
          <PhaseText>Phase: </PhaseText>
          {phaseInfo[currentPhase].name}
        </SubTitle>
        <Description>{phaseInfo[currentPhase].description}</Description>
      </Header>

      <DaySelector>
        <DayControls>
          <Button
            onClick={() => handleDayChange(currentDay - 1)}
            disabled={currentDay === 1}
          >
            ←
          </Button>
          <DayDisplay>
            <DayText>DAY</DayText>
            <DayNumber>{currentDay}</DayNumber>
            <DayText dim>/</DayText>
            <DayText dim>90</DayText>
          </DayDisplay>
          <Button
            onClick={() => handleDayChange(currentDay + 1)}
            disabled={currentDay === 90}
          >
            →
          </Button>
        </DayControls>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          width: '100%', 
          maxWidth: '500px' 
        }}>
          <DayCompletionCheckbox onClick={() => toggleDayCompletion(currentDay)}>
            <Checkbox checked={completedDays[currentDay]}>
              {completedDays[currentDay] && "✓"}
            </Checkbox>
            <span>Mark Day Complete</span>
          </DayCompletionCheckbox>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            flexWrap: 'wrap' 
          }}>
            <DayText>JUMP TO:</DayText>
            <DayInput
              type="number"
              min="1"
              max="90"
              value={tempDay}
              onChange={handleDayInputChange}
              onKeyPress={handleKeyPress}
            />
            <GoButton onClick={jumpToDay}>GO</GoButton>
          </div>
        </div>
      </DaySelector>

      <ProgressSection>
        <Card>
          <CardTitle>Overall Program Progress</CardTitle>
          <ProgressBar>
            <Progress percentage={(currentDay / totalDays) * 100} />
          </ProgressBar>
          <ProgressText>{currentDay} days completed</ProgressText>
        </Card>
        <Card>
          <PhaseProgressHeader>
            <CardTitle>{phaseNames[currentPhase]} Phase Progress</CardTitle>
            {nextPhase && (
              <NextPhaseButton onClick={jumpToNextPhase}>
                Next: {phaseNames[nextPhase]} →
              </NextPhaseButton>
            )}
          </PhaseProgressHeader>
          <ProgressBar>
            <Progress
              percentage={getCurrentPhaseProgress()}
              color={phaseInfo[currentPhase].color}
            />
          </ProgressBar>
          <ProgressText>
            {currentPhase === 1
              ? currentDay
              : currentPhase === 2
              ? currentDay - 30
              : currentDay - 60}{" "}
            / 30 days
          </ProgressText>
        </Card>
      </ProgressSection>

      <TabsContainer>
        <TabButtons>
          <TabButton
            active={activeTab === "schedule"}
            onClick={() => setActiveTab("schedule")}
          >
            <TabIcon>📅</TabIcon>
            <TabLabel>Schedule</TabLabel>
          </TabButton>
          <TabButton
            active={activeTab === "training"}
            onClick={() => setActiveTab("training")}
          >
            <TabIcon>💪</TabIcon>
            <TabLabel>Training</TabLabel>
          </TabButton>
          <TabButton
            active={activeTab === "nutrition"}
            onClick={() => setActiveTab("nutrition")}
          >
            <TabIcon>🍏</TabIcon>
            <TabLabel>Nutrition</TabLabel>
          </TabButton>
          <TabButton
            active={activeTab === "mindset"}
            onClick={() => setActiveTab("mindset")}
          >
            <TabIcon>🧠</TabIcon>
            <TabLabel>Mindset</TabLabel>
          </TabButton>
          <TabButton
            active={activeTab === "supplements"}
            onClick={() => setActiveTab("supplements")}
          >
            <TabIcon>💊</TabIcon>
            <TabLabel>Supplements</TabLabel>
          </TabButton>
          <TabButton
            active={activeTab === "recovery"}
            onClick={() => setActiveTab("recovery")}
          >
            <TabIcon>🧘</TabIcon>
            <TabLabel>Recovery</TabLabel>
          </TabButton>
          <TabButton
            active={activeTab === "checklist"}
            onClick={() => setActiveTab("checklist")}
          >
            <TabIcon>✓</TabIcon>
            <TabLabel>Checklist</TabLabel>
          </TabButton>
          <TabButton
            active={activeTab === "shopping"}
            onClick={() => setActiveTab("shopping")}
          >
            <TabIcon>🛒</TabIcon>
            <TabLabel>Shopping</TabLabel>
          </TabButton>
        </TabButtons>
        <TabContent>{renderTabContent()}</TabContent>
      </TabsContainer>
    </Container>
  );
}

export default App;
