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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background-color: #2d3748;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(8, 1fr);
  }
`;

const TabButton = styled.button`
  background-color: ${(props) => (props.active ? "#4a5568" : "#2d3748")};
  color: ${(props) => (props.active ? "#ecc94b" : "white")};
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  margin-right: 8px;
  margin-bottom: 8px;
  box-shadow: ${(props) => (props.active ? "0 2px 4px rgba(0, 0, 0, 0.2)" : "0 1px 2px rgba(0, 0, 0, 0.1)")};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${(props) => (props.active ? "#4a5568" : "#3a4556")};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TabIcon = styled.span`
  margin-bottom: 4px;
  font-size: 18px;
`;

const TabLabel = styled.span`
  font-size: 11px;
`;

const TabContent = styled.div`
  margin-top: 16px;
`;

const ScheduleItem = styled.div`
  display: flex;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #4a5568;
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const Time = styled.div`
  width: 80px;
  font-weight: bold;
  color: #ecc94b;
`;

const Activity = styled.div`
  flex-grow: 1;
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
  margin-top: 15px;
  padding: 12px;
  background-color: #1f2937;
  border-radius: 4px;
  border-left: 3px solid #ecc94b;
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

const CategoryTitle = styled.div`
  font-weight: bold;
  color: #ecc94b;
  margin: 16px 0 8px 0;
`;

const ShoppingCategory = styled.div`
  margin-bottom: 20px;
`;

const ShoppingItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding-left: 16px;
`;

const VisualizationScript = styled.div`
  background-color: #1f2937;
  padding: 15px;
  border-radius: 4px;
  margin-top: 12px;
  border-left: 3px solid #805ad5;
  font-style: italic;
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
    if (currentPhase === 1) {
      if (currentDay <= 5) {
        return {
          title: "Water Fast",
          description:
            "Strict water fast with electrolytes and specific supplements only",
          items: [
            "Morning: 1 tbsp apple cider vinegar + 1/4 tsp salt in 16oz water",
            "Throughout day: 3-4 liters water with electrolytes",
            "Evening: 1 tbsp MCT oil to maintain ketone production",
          ],
          details: [
            "Prepare 2 gallons of water each morning with electrolyte mix (1000mg sodium, 300mg potassium, 300mg magnesium per gallon)",
            "When hunger strikes: 1 cup warm water with 1/2 tsp Himalayan salt",
            "For energy crashes: Take 5 deep breaths, 10 pushups, then 1/2 tbsp MCT oil",
            "Brush teeth at noon and 8pm to reduce hunger signals",
            "If extreme fatigue: 1/4 tsp sea salt under tongue, wait 60 seconds before swallowing",
          ],
          mealPlan: "Complete fast - no solid foods for entire 5 days",
        };
      } else if (currentDay <= 10) {
        return {
          title: "Snake Diet Protocol",
          description: "48-hour water fasts broken by 4-hour eating window",
          items: [
            "Eating window: High protein (1.5g/lb lean mass)",
            "Moderate fat, near-zero carb",
            "Supplements during eating window only",
          ],
          details: [
            "Fasting fluid mix: 2L water with 1 tsp sea salt, 1/2 tsp potassium chloride (Nu-Salt), 1/2 tsp food-grade magnesium sulfate",
            "Breaking fast properly: Start with bone broth 10 min before first solid food",
            "First solid meal: 6oz protein (salmon, beef, eggs) with 1 tbsp fat (olive oil, butter)",
            "Second meal (60 min later): 8oz protein, 2 cups non-starchy vegetables, 1-2 tbsp fat",
            "Supplement timing: All daily supplements taken with second meal",
          ],
          mealPlan: {
            refeeding:
              "Day " +
              currentDay +
              " is a " +
              (currentDay % 2 === 0 ? "FEEDING" : "FASTING") +
              " day",
            feedingWindow: "5:00 PM - 9:00 PM only",
            meals: [
              {
                time: "5:00 PM",
                food: "8oz bone broth with 1 tbsp grass-fed butter",
              },
              {
                time: "5:30 PM",
                food: "6-8oz grass-fed ribeye steak with pink salt and apple cider vinegar",
              },
              {
                time: "7:00 PM",
                food: "4 whole pasture-raised eggs with 2 cups sautéed spinach in coconut oil",
              },
              {
                time: "8:30 PM",
                food: "5oz wild salmon with 1 cup broccoli in grass-fed butter",
              },
            ],
          },
        };
      } else {
        return {
          title: "Warrior Diet + Strategic Refeed",
          description:
            "20:4 fasting protocol (20 hours fasting, 4-hour evening window)",
          items: [
            "One weekly high-carb refeed day (300g complex carbs)",
            "Other days: High protein, moderate fat, low carb",
            "Focus on grass-fed beef, wild fish, organ meats",
          ],
          details: [
            "During 20-hour fasting window: Water, black coffee, green tea only",
            "Pre-workout (fasted state): 1 tbsp MCT oil + 5g essential amino acids",
            "Breaking fast (post workout): 40g whey protein isolate, 10g glutamine",
            "Eating window strategy: Start with protein/fat, end with any carbs",
            "Refeed day strategy (Day " +
              (currentDay - (currentDay % 7) + 6) +
              "): Front-load carbs in morning, taper through day",
          ],
          mealPlan: {
            refeedDay: currentDay % 7 === 6,
            meals:
              currentDay % 7 === 6
                ? [
                    {
                      time: "6:00 AM",
                      food: "2 cups white rice with cinnamon and 2 tbsp honey + 4 whole eggs",
                    },
                    {
                      time: "9:00 AM",
                      food: "1 large sweet potato, 6oz chicken breast, 1 tbsp olive oil",
                    },
                    {
                      time: "12:00 PM",
                      food: "8oz grass-fed beef, 1 cup white rice, 1 cup vegetables",
                    },
                    {
                      time: "3:00 PM",
                      food: "2 bananas, 40g whey protein, 1 tbsp almond butter",
                    },
                    {
                      time: "6:00 PM",
                      food: "8oz wild salmon, 1 cup quinoa, 2 cups mixed vegetables",
                    },
                  ]
                : [
                    {
                      time: "5:00 PM",
                      food: "10oz grass-fed beef/wild-caught salmon/free-range chicken with 2 cups vegetables cooked in 2 tbsp fat (butter/tallow/coconut oil)",
                    },
                    {
                      time: "7:00 PM",
                      food: "3-5 whole eggs with 1/4 avocado and 2 cups leafy greens",
                    },
                    {
                      time: "8:30 PM",
                      food: "Protein shake: 40g protein with 1 tbsp MCT oil and 1 tbsp nut butter",
                    },
                  ],
          },
        };
      }
    } else if (currentPhase === 2) {
      return {
        title: "Metabolic Flexibility Development",
        description: "Alternate Day Modified Fasting",
        items: [
          "36-hour fasts followed by 12-hour feeding windows",
          "Feeding days: 3000-3500 calories, high protein",
          "Strategic pre/post workout nutrition timing",
        ],
        details: [
          "Fasting days: Structured electrolyte supplementation every 4 hours",
          "Pre-training (fasting day): 10g essential amino acids, 6g l-citrulline, 200mg caffeine",
          "Post-training (fasting day): 30g protein isolate, no carbs, 5g BCAA",
          "Feeding day strategy: 4 meals, highest carbs post-workout, protein at every meal",
          "Nighttime recovery blend: 30g casein protein, 5g glycine, 3g magnesium threonate",
        ],
        mealPlan: {
          feedingDay: currentDay % 2 === 0,
          meals:
            currentDay % 2 === 0
              ? [
                  {
                    time: "6:00 AM",
                    food: "6 whole eggs, 1 cup vegetables, 1 tbsp olive oil, 1/4 avocado",
                  },
                  {
                    time: "Post-workout",
                    food: "60g whey protein, 70g fast-digesting carbs (rice/potatoes), 5g creatine",
                  },
                  {
                    time: "1:00 PM",
                    food: "10oz lean protein (chicken/turkey/white fish), 1 cup rice, 2 cups vegetables",
                  },
                  {
                    time: "6:00 PM",
                    food: "10oz fatty protein (ribeye/salmon), 2 cups vegetables, 2 tbsp fat source",
                  },
                  {
                    time: "Before bed",
                    food: "30g casein protein, 1 tbsp almond butter, 5g glycine",
                  },
                ]
              : [
                  {
                    time: "All day",
                    food: "Water fast with scheduled electrolytes - Complete fasting protocol",
                  },
                  {
                    time: "Pre-workout",
                    food: "10g essential amino acids, 6g citrulline malate, 200mg caffeine",
                  },
                  {
                    time: "Post-workout",
                    food: "30g protein isolate, 5g BCAA, 0g carbs",
                  },
                ],
        },
      };
    } else {
      return {
        title: "Performance Optimization",
        description: "Targeted Ketogenic Diet pattern",
        items: [
          "Training days: 100-150g carbs post-workout only",
          "Non-training days: Under 30g carbs, high protein, high fat",
          "Weekly carb-loading day (400-500g)",
        ],
        details: [
          "Daily intermittent fasting: 16/8 protocol (first meal at noon)",
          "Pre-training nutrition: 1 tbsp MCT oil, 10g EAAs, 5g creatine, 300mg caffeine",
          "Post-training window: 50g whey isolate + 50-60g dextrose + 5g creatine (training days only)",
          "Post-workout meal (within 90 minutes): 8oz protein, 100g carbs from white rice/potato",
          "Strategic carb loading: Day " +
            (currentDay - (currentDay % 7) + 6) +
            " is high-carb (gradual increase throughout day)",
        ],
        mealPlan: {
          trainingDay: currentDay % 7 !== 0,
          carb_loadDay: currentDay % 7 === 6,
          meals:
            currentDay % 7 === 6
              ? [
                  {
                    time: "6:00 AM",
                    food: "2 cups oatmeal, 2 bananas, 2 tbsp honey, 40g whey protein",
                  },
                  {
                    time: "9:00 AM",
                    food: "2 cups white rice, 8oz chicken breast, 1 cup vegetables",
                  },
                  {
                    time: "12:00 PM",
                    food: "2 large sweet potatoes, 8oz lean beef, 2 cups vegetables",
                  },
                  {
                    time: "3:00 PM",
                    food: "2 cups rice, 2 bananas, 40g whey protein",
                  },
                  {
                    time: "6:00 PM",
                    food: "12oz lean protein, 2 cups potatoes, 2 cups vegetables",
                  },
                  {
                    time: "9:00 PM",
                    food: "1 cup rice, 30g casein protein, 1 tbsp honey",
                  },
                ]
              : currentDay % 7 !== 0
              ? [
                  {
                    time: "12:00 PM",
                    food: "6oz protein (eggs/salmon), 1/2 avocado, 2 cups vegetables",
                  },
                  {
                    time: "Pre-workout",
                    food: "10g EAAs, 5g creatine, 300mg caffeine, 1 tbsp MCT oil",
                  },
                  {
                    time: "Post-workout",
                    food: "50g whey isolate + 50g dextrose + 5g creatine",
                  },
                  {
                    time: "Post-workout meal",
                    food: "10oz lean protein, 100g carbs from white rice/potato, 2 cups vegetables",
                  },
                  {
                    time: "Final meal",
                    food: "8oz fatty protein, 2 cups green vegetables, 2 tbsp healthy fat",
                  },
                ]
              : [
                  {
                    time: "12:00 PM",
                    food: "6 whole eggs, 1/2 avocado, 2 cups spinach, 2 tbsp olive oil",
                  },
                  {
                    time: "4:00 PM",
                    food: "10oz fatty fish, 2 cups broccoli, 2 tbsp butter",
                  },
                  {
                    time: "8:00 PM",
                    food: "10oz ribeye steak, 2 cups asparagus, 1 tbsp butter, 1/2 avocado",
                  },
                ],
        },
      };
    }
  };

  const getDailyTrainingPlan = () => {
    if (currentPhase === 1) {
      return {
        title: "Foundation Building",
        description: "Establish fundamentals while protecting the knee",
        items: [
          "Knee Rehab: Contrast therapy, BFR training",
          "Boxing: Shadow boxing with 1lb wrist weights",
          "Conditioning: Modified Tabata sprints, hill crawling",
          "Strength: Bodyweight circuits with isometric holds",
        ],
        details: {
          kneeRehab: [
            "Morning contrast therapy protocol: 3 minutes ice, 1 minute hot water, repeat 5x",
            "BFR training setup: Use knee wraps at 7/10 tightness (should feel pressure but not pain)",
            "Terminal knee extensions: 4 sets of 25 reps with minimal resistance",
            "Static VMO contractions: 5 sets of 45-second holds with maximum contraction",
            "Wall slides with band: 3 sets of 15 with band just above knees",
          ],
          boxingTechnique: [
            "Shadow boxing: 10 x 3 minute rounds with 30 second rest periods",
            "Focus on Tyson-style head movement: Pendulum sway + peek-a-boo guard",
            "Perfect the Tyson pivot: Left foot plants, right foot pivots for power generation",
            "Practice jabbing from defensive shell position → snap out, snap back quickly",
            "Work on weight transfer: 70% weight on front foot when jabbing, 60% on back foot when loading up hooks",
          ],
          conditioning: [
            "Modified Tabata protocol: 20 seconds maximum effort, 10 seconds rest, 8 rounds",
            "Exercise rotation: Seated punches → Stationary bike → Medicine ball rotations → Shadowboxing",
            "Hill/incline crawling: Find any incline and bear crawl up 5-10 times",
            "Cool down: 5 minutes of deep breathing (4 count in, 6 count out)",
          ],
          strength: [
            "Circuit 1: Push-up variations (5 sets of max reps) → 60s rest → Pull-up progressions (5 sets of max reps/holds)",
            "Circuit 2: Single-leg exercises for uninjured leg → 60s rest → Isometric boxing position holds",
            "Core circuit: 60s hollow body hold → 30s rest → 60s side plank each side → 30s rest → 60s superman hold",
            "Neck strengthening: 4-way isometric holds using hand resistance (30s each direction)",
          ],
        },
        workoutSchedule: [
          { day: "Monday", focus: "Upper body power + boxing fundamentals" },
          { day: "Tuesday", focus: "Conditioning + knee rehab focus" },
          { day: "Wednesday", focus: "Active recovery + mobility" },
          {
            day: "Thursday",
            focus: "Core and rotational power + boxing technique",
          },
          {
            day: "Friday",
            focus: "Lower body (modified for knee) + conditioning",
          },
          { day: "Saturday", focus: "Full boxing integration workout" },
          {
            day: "Sunday",
            focus: "Complete rest + extended recovery protocols",
          },
        ],
      };
    } else if (currentPhase === 2) {
      return {
        title: "Power Development",
        description: "Build the physical weapons of a fighter",
        items: [
          "Knee Progress: Spanish Squat technique, single-leg balance",
          "Boxing: Focus on Tyson's peekaboo style and explosiveness",
          "Conditioning: Swimming, controlled stair sprints",
          "Strength: Isometric training in fight positions",
        ],
        details: {
          kneeRehab: [
            "Spanish Squat progression: Using belt/band around sturdy object at knee height, lean back to create tension",
            "Perform 5 sets of 12-15 controlled squats focusing on perfect alignment",
            "Single-leg balance progression: 60s per leg → 60s with eyes closed → 60s on unstable surface",
            "Controlled step-ups: 4 sets of 15 per leg using 4-6 inch platform",
            "Knee-friendly plyometrics: Box step-ups with 1-second pause at top position",
          ],
          boxingTechnique: [
            "Peekaboo style development: Practice shell defense with chin tucked, elbows tight, forearms protecting face",
            "Explosive inside fighting: Work on hooks and uppercuts from close range with maximum rotation",
            "2-3lb weighted shadowboxing: 8 rounds of 3 minutes, focus on power generation",
            "Slip bag training: Create makeshift slip bag with hanging towel/small bag, practice head movement",
            "Combination development: Work on Tyson's signature combinations (jab → right → left hook → right uppercut)",
          ],
          conditioning: [
            "Swimming protocol (if available): 20 minutes of upper-body only swimming",
            "Controlled stair training: Fast ascent with controlled descent to protect knee",
            "Medicine ball exercises: Create homemade weighted ball, 100 explosive throws against wall/ground",
            "Interval training: 40s work / 20s rest for 15-20 minutes using knee-friendly movements",
          ],
          strength: [
            "Isometric training: 30-60 second maximum tension holds in fighting positions",
            "Partner resistance (or DIY): Apply resistance to punches at various points in the movement",
            "Explosive push-up variations: Create maximum acceleration through range of motion",
            "Rotational power: Medicine ball throws focusing on hip rotation and core engagement",
            "Single-leg progression: Advance to controlled lunges on unaffected leg",
          ],
        },
        workoutSchedule: [
          {
            day: "Monday",
            focus: "Explosive power + advanced boxing technique",
          },
          { day: "Tuesday", focus: "Speed-endurance + footwork (modified)" },
          { day: "Wednesday", focus: "Strength focus + technical sparring" },
          { day: "Thursday", focus: "Active recovery + knee progression" },
          { day: "Friday", focus: "Conditioning + bag work alternatives" },
          { day: "Saturday", focus: "Fight simulation (full rounds)" },
          { day: "Sunday", focus: "Active recovery + mindset development" },
        ],
      };
    } else {
      return {
        title: "Fighting Mastery",
        description: "Refine and integrate all skills",
        items: [
          "Knee Finalization: Controlled jumping/landing mechanics",
          "Boxing: Perfect 3-5 signature combinations",
          "Conditioning: 12 rounds with 15-second breaks",
          "Power: Explosive movement patterns, resistance training",
        ],
        details: {
          kneeRehab: [
            "Progress to controlled jumping mechanics: Start with minimal height, focus on soft landings",
            "Landing technique: Land through ball of foot → mid-foot → heel with knee tracking over toe",
            "Lateral movement pattern training: Sideways stepping progression with band resistance",
            "Full Bulgarian split squat progression: 4 sets of 12-15 reps with bodyweight",
            "Implement kneesovertoesguy posterior chain exercises: Nordic hamstring curls, ATG split squats",
          ],
          boxingTechnique: [
            "Signature combination mastery: Perfect 3-5 combinations with devastating power",
            "Timing drills: Have partner throw objects of varying speeds to counter (or use wall rebounds)",
            "Speed-power contrast training: 30s ultra-fast shadowboxing → 30s maximum power strikes",
            "Ring cutting practice: Work on Tyson's pressure footwork to trap opponents (use chalk outline)",
            "Inside fighting mastery: Practice getting inside opponent's reach and launching devastating hooks/uppercuts",
          ],
          conditioning: [
            "Championship endurance: 12 rounds of shadowboxing with only 15-second breaks",
            "Anaerobic threshold training: Modified burpees 60s all-out / 60s recovery × 10 rounds",
            "Sledgehammer training: Use homemade implement (filled bag on rope) for 10 × 60s rounds",
            "Isometric cardiovascular training: Hold horse stance while throwing combinations",
          ],
          strength: [
            "Plyometric push-up variations: Clap push-ups, uneven surface push-ups (3 sets of 10-15)",
            "Rotational medicine ball throws: Maximum velocity wall throws from fighting stance (100 total)",
            "Resistance band punching: Create progressive tension for straight punches and hooks",
            "Bulgarian bag training: Use homemade implement for swings, squats, and rotational movements",
            "Explosive hip hinge movements: Focus on posterior chain power development",
          ],
        },
        workoutSchedule: [
          {
            day: "Monday",
            focus: "Fight-specific power + advanced combinations",
          },
          {
            day: "Tuesday",
            focus: "Championship conditioning + technical refinement",
          },
          {
            day: "Wednesday",
            focus: "Active recovery + specific skill development",
          },
          { day: "Thursday", focus: "Explosive speed + timing work" },
          { day: "Friday", focus: "Strength maintenance + power endurance" },
          {
            day: "Saturday",
            focus: "Complete fight simulation (with audience if possible)",
          },
          { day: "Sunday", focus: "Strategic recovery + fight psychology" },
        ],
      };
    }
  };

  const getDailyMindsetPlan = () => {
    if (currentPhase === 1) {
      return {
        title: "Psychological Foundation",
        description: "Breaking mental limitations",
        items: [
          "Morning: Cold exposure, visualization, affirmations",
          "Evening: Fear inventory practice, pain threshold extension",
          "Rage channeling meditation",
          "Identity reconstruction exercises",
        ],
        details: [
          "Cold exposure protocol: Start with 30 seconds, add 30 seconds daily up to 5 minutes maximum",
          "Visualization technique: See yourself moving with Tyson's speed, power, and confidence",
          "Affirmation structure: Record in your own voice, play back during morning routine",
          "Fear inventory process: Write down all fears about training/fighting, burn the paper afterward",
          "Pain threshold extension: Ice immersion of hands while maintaining focus and controlled breathing",
        ],
        visualizationScript:
          "Close your eyes. Breathe deeply. See yourself standing in the center of the ring. Feel the canvas under your feet. Notice the weight of your gloves, the wraps tight against your wrists. Your body feels powerful, coiled like a spring. Your muscles are dense, explosive. See yourself moving like Tyson - the subtle shifts of weight, the explosive power. Watch yourself slip a punch with ease, then unleash a devastating hook that connects perfectly. Feel the perfect transfer of energy from your legs, through your hips, into your shoulder and fist. Your opponent cannot match your intensity, your focus, your power. You are unstoppable. You are becoming a living weapon. Remember this feeling.",
        affirmations: [
          "I am rebuilding myself into a weapon",
          "My body responds instantly to my commands",
          "Pain is temporary, victory is forever",
          "I channel intensity into perfect execution",
          "My opponent feels fear when they see my confidence",
          "I am developing the mind and body of a champion fighter",
        ],
      };
    } else if (currentPhase === 2) {
      return {
        title: "Tyson Mentality Development",
        description: "Building the predator mindset",
        items: [
          "Study and internalize Tyson interviews and training",
          "Fear inoculation through controlled exposure",
          "Contrast therapy extremes for mental toughness",
          "Strategic insomnia training once weekly",
        ],
        details: [
          "Tyson study protocol: Watch 30 minutes of fight footage daily, focusing on specific techniques",
          "Fear inoculation method: Progressively expose yourself to intimidating situations/people",
          "Contrast therapy extreme technique: Transition directly from ice bath to hottest bearable shower",
          "Insomnia training purpose: Once weekly all-night training teaches your mind to function through adversity",
          "Predator mindset development: Practice the focused, calculating gaze Tyson was known for",
        ],
        visualizationScript:
          "Breathe deeply. Feel your heartbeat steady and strong. Now imagine yourself as a predator - powerful, patient, calculating. See yourself across from your opponent. Notice how they avoid your gaze, how they shift nervously. You feel no anxiety, only focused awareness. Your mind is clear, your body primed. You see their every movement in perfect clarity. Time seems to slow. You notice their weight shift slightly - telegraphing their intention before they even throw. Your response is automatic, devastating. Just like Tyson, you slip their punch and counter with perfect precision. Feel the raw power moving through your body. The perfect shot lands and you immediately reset, ready to attack again. This is not about emotion - this is about perfect execution. You are becoming the perfect fighting machine. Your opponent feels your predatory presence and begins to doubt themselves. You are in complete control.",
        affirmations: [
          "I am developing the mind of a champion",
          "I see everything in the ring with perfect clarity",
          "My opponents feel my predatory presence before I even move",
          "I remain calm when others panic",
          "I attack with controlled aggression and perfect timing",
          "My mind remains sharp under extreme pressure",
        ],
      };
    } else {
      return {
        title: "Combat Psychology Mastery",
        description: "Becoming a psychological weapon",
        items: [
          "Intimidation aura development practice",
          "Mental triggers for instant aggression",
          "Fight outcome visualization with sensory richness",
          "Pre-fight ritual development and testing",
        ],
        details: [
          "Intimidation aura practice: Develop intense eye contact and dominant body language daily",
          "Mental trigger technique: Create specific words or movements that instantly trigger fighting state",
          "Outcome visualization: Practice seeing successful fight outcomes with complete sensory detail",
          "Pre-fight ritual: Develop and refine your own unique pre-fight ritual to center your mind",
          "Controlled aggression training: Channel emotional energy into technical execution",
        ],
        visualizationScript:
          "Close your eyes. Take three deep breaths. Now see yourself in the moments before your fight. Feel the energy in your body - not nervous energy, but focused power. See yourself performing your pre-fight ritual perfectly. Now you're entering the ring. Notice how the crowd reacts to your presence. You exude dangerous confidence. Your opponent can feel it. The bell rings. You move forward with controlled aggression, cutting off the ring just like Tyson. Your defensive shell is perfect. You slip a jab and counter with your signature combination - the one you've practiced thousands of times. It lands with devastating impact. You maintain perfect focus, never losing control. You see openings before they even appear. Your timing is supernatural. Every punch you throw has bad intentions, but your mind remains tactical. You are the perfect balance of explosive power and strategic thinking. See yourself dominating every exchange. Feel the moment of victory. The referee raising your hand. This outcome is inevitable if you execute your training perfectly.",
        affirmations: [
          "I am a complete fighter with unstoppable weapons",
          "My presence alone creates doubt in my opponents",
          "I fight with controlled fury and perfect technique",
          "I see openings before they appear",
          "My mind remains tactical even in the heat of battle",
          "I am becoming the fighter I was born to be",
        ],
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
    ];

    if (currentPhase === 1) {
      return {
        title: "Foundation Supplements",
        items: [
          ...coreSupplements,
          "Electrolytes (crucial during fasting)",
          "CBD Oil: 50-100mg (anti-inflammatory)",
        ],
        details: {
          dosage: [
            "Magnesium Glycinate: 200mg morning, 200mg evening with food",
            "Vitamin D3: 5,000 IU with breakfast with K2 (100mcg)",
            "Fish Oil: 3g with first meal (higher EPA than DHA ratio)",
            "Creatine: 5g mixed in water, consistent timing daily",
            "Zinc: 25mg with dinner (not with calcium, separate from magnesium)",
            "Electrolytes: Sodium 3-5g, Potassium 1-2g, Magnesium 400mg throughout day",
            "CBD Oil: 50mg morning, 50mg evening (full spectrum if available)",
          ],
          timing: [
            "Morning: Vitamin D3/K2, Fish Oil, Creatine, CBD Oil (first dose)",
            "Throughout day: Electrolytes in divided doses",
            "Evening: Magnesium, Zinc (separate by 2 hours), CBD Oil (second dose)",
          ],
          brandRecommendations: [
            "Magnesium: Doctor's Best High Absorption Magnesium",
            "Vitamin D3/K2: Thorne D3/K2 Liquid",
            "Fish Oil: Nordic Naturals Ultimate Omega",
            "Creatine: Creapure Creatine Monohydrate (any brand using this)",
            "Electrolytes: LMNT or DIY mix (sodium, potassium chloride, magnesium)",
            "CBD: Charlotte's Web or Lazarus Naturals",
          ],
        },
      };
    } else if (currentPhase === 2) {
      return {
        title: "Performance Enhancers",
        items: [
          ...coreSupplements,
          "Beta-Alanine: 3-5g daily (split doses)",
          "Citrulline Malate: 8-10g pre-workout",
          "Ashwagandha: 600mg twice daily",
        ],
        details: {
          dosage: [
            "Magnesium: Increase to 600mg total daily (300mg morning, 300mg evening)",
            "Vitamin D3: Maintain 5,000 IU with K2 (100mcg)",
            "Fish Oil: Increase to 4g daily with meals",
            "Creatine: Maintain 5g daily, consistent timing",
            "Zinc: Cycle 50mg for 3 weeks, 0mg for 1 week",
            "Beta-Alanine: 2g morning, 2g afternoon (expect tingling sensation)",
            "Citrulline Malate: 8-10g 30 minutes before training",
            "Ashwagandha: 600mg morning, 600mg evening (KSM-66 extract)",
          ],
          timing: [
            "Morning: Vitamin D3/K2, Fish Oil (2g), Creatine, Beta-Alanine (first dose), Ashwagandha (first dose)",
            "Pre-workout: Citrulline Malate, remaining Beta-Alanine",
            "Post-workout: Fish Oil (remaining 2g)",
            "Evening: Magnesium, Zinc (on schedule), Ashwagandha (second dose)",
          ],
          brandRecommendations: [
            "Beta-Alanine: NOW Sports Beta-Alanine",
            "Citrulline Malate: BulkSupplements or Nutricost (2:1 ratio)",
            "Ashwagandha: Jarrow Formulas or Nootropics Depot KSM-66",
            "Continue high-quality brands for core supplements",
          ],
        },
      };
    } else {
      return {
        title: "Peak Performance Stack",
        items: [
          ...coreSupplements,
          "Exogenous Ketones: 10-15g before training",
          "Turkesterone: 500mg daily",
          "L-Carnitine L-Tartrate: 2-4g daily",
        ],
        details: {
          dosage: [
            "Maintain all core supplements at Phase 2 levels",
            "Exogenous Ketones: 10-15g mixed in water 30 minutes pre-training",
            "Turkesterone: 500mg daily with food (morning meal)",
            "L-Carnitine L-Tartrate: 2g morning, 2g afternoon",
            "Add Tart Cherry Extract: 1500mg before bed (recovery)",
            "Add Glycine: 3g before bed (sleep quality)",
            "Optional: Methylene Blue 10mg (where legally available)",
          ],
          timing: [
            "Morning: Core supplements + Turkesterone + L-Carnitine (first dose)",
            "Pre-workout: Exogenous Ketones, L-Carnitine (second dose)",
            "Evening: Remaining core supplements",
            "Before bed: Tart Cherry Extract, Glycine, Magnesium",
          ],
          brandRecommendations: [
            "Exogenous Ketones: Perfect Keto or KetoCaNa",
            "Turkesterone: Gorilla Mind or Double Wood",
            "L-Carnitine L-Tartrate: NOW Sports or Nutricost",
            "Tart Cherry: Sports Research or Horbäach",
            "Glycine: BulkSupplements or NOW Foods",
          ],
        },
      };
    }
  };

  const getRecoveryProtocols = () => {
    if (currentPhase === 1) {
      return {
        title: "Foundation Recovery",
        description: "Establish baseline recovery protocols",
        items: [
          "Contrast therapy: 3 min cold, 1 min hot x5",
          "Red light therapy for knee (15-20 min)",
          "Compression using DIY methods",
          "Sleep optimization: Temperature control, blackout",
        ],
        details: [
          "Contrast therapy exact protocol: Start with 3 min ice bath (50-60°F), immediately transition to 1 min hot shower (as hot as tolerable), repeat 5 cycles, always finish with cold",
          "DIY red light therapy: Use 660nm and 850nm LED bulbs positioned 6-12 inches from knee for 15-20 minutes daily",
          "Compression technique: Use Ace bandages for 30-60 minutes post-training with legs elevated",
          "Sleep optimization protocol: Bedroom at 60-65°F, complete blackout, no electronics 2 hours before bed",
          "Breath work technique: 4-7-8 breathing pattern before sleep (4 second inhale, 7 second hold, 8 second exhale)",
        ],
        implementation: [
          "Create contrast therapy setup: Large container with ice water + hot shower access",
          "Purchase 2-3 quality ice packs for knee therapy between contrast sessions",
          "Block all light sources in bedroom with blackout curtains or aluminum foil if needed",
          "Create sleep trigger routine: Same 3-4 actions performed in same order nightly",
          "Track sleep quality daily on 1-10 scale to measure improvement",
        ],
      };
    } else if (currentPhase === 2) {
      return {
        title: "Advanced Recovery",
        description: "Accelerate recovery between intense sessions",
        items: [
          "Extended contrast therapy protocols",
          "DIY percussion massage techniques",
          "Hyperbaric environment simulation",
          "Strategic liver support supplementation",
        ],
        details: [
          "Enhanced contrast therapy: Progress to 4 min cold (45-50°F) / 1 min hot / 8 cycles",
          "DIY percussion massage: Modified jigsaw with softball attachment (or tennis ball in sock)",
          "Target: 2-3 minutes per major muscle group, focus on fascia release",
          "Hyperbaric simulation: Wim Hof breathing (30 power breaths, retention, recovery breath), 3 rounds pre-sleep",
          "Liver support protocol: Milk thistle extract (1000mg) + dandelion root (1000mg) daily",
          "Nighttime recovery stack: Magnesium (400mg) + glycine (3g) + tart cherry extract (1000mg)",
        ],
        implementation: [
          "Create structured recovery sessions: 20-30 minutes dedicated solely to recovery work",
          "Schedule contrast therapy immediately post-training",
          "Position massage tools in training area for immediate access",
          "Create dedicated recovery space with necessary tools organized",
          "Recovery scorecard: Rate soreness 1-10 before/after recovery protocols",
        ],
      };
    } else {
      return {
        title: "Elite Recovery",
        description: "Maximize recovery for peak performance",
        items: [
          "Comprehensive contrast therapy",
          "Advanced breath work for parasympathetic activation",
          "Strategic compression protocols",
          "Final sleep optimization techniques",
        ],
        details: [
          "Final contrast protocol: 5 min cold (40-45°F) / 1 min hot / 10 cycles with 1g vitamin C before session",
          "Parasympathetic activation: 4:8 breathing (4 second inhale, 8 second exhale) for 5 minutes post-training",
          "Advanced compression: Combination of elevation, compression bandages, and manual lymphatic drainage techniques",
          "Elite sleep protocol: Temperature regulation, complete darkness, white noise, mouth taping, weighted blanket",
          "CNS recovery technique: Alternate nostril breathing 10 minutes before bed",
        ],
        implementation: [
          "Prepare post-workout recovery kit: Timer, compression materials, breath work instructions",
          "Dedicate 45-60 minutes daily solely to recovery protocols",
          "Create ultimate sleep environment: Cool, dark, quiet, with backup solutions while traveling",
          "Develop pre-fight recovery timeline: Specific protocols for 3 days, 2 days, 1 day before fighting",
          "Travel recovery kit: Portable tools that maintain recovery quality when away from home",
        ],
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
            "CBD oil (if budget allows)",
          ],
          groceries: [
            "Filtered water (or water filter)",
            "Green tea (unsweetened)",
            "Fresh lemon (for morning water)",
            "Bone broth (for breaking fast later)",
          ],
          equipment: [
            "Multiple 1-gallon water containers",
            "Cold thermometer (to measure water temperature)",
            "Ice packs or bags of ice",
            "Kitchen scale for supplement measuring",
            "Journal for tracking fasting experience",
          ],
        };
      } else if (currentDay <= 10) {
        return {
          supplements: [
            "Himalayan or sea salt (1 lb)",
            "Potassium chloride (No-Salt or Nu-Salt brand)",
            "Magnesium supplement (glycinate preferred)",
            "Apple cider vinegar (with the mother)",
            "Core supplements: Fish oil, D3, Zinc",
            "Bone broth powder/cubes (for breaking fast)",
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
            "Avocados (2-3)",
          ],
          equipment: [
            "Food scale for precise protein measurement",
            "Meal preparation containers",
            "Timer for fasting windows",
            "Ice bath container or large tub",
          ],
        };
      } else {
        return {
          supplements: [
            "All core supplements: Magnesium, D3/K2, Fish Oil, Creatine, Zinc",
            "Electrolyte materials (salt, potassium chloride, magnesium)",
            "Whey protein isolate (low carb)",
            "Essential amino acids (EAAs)",
            "MCT oil",
            "CBD oil for recovery (optional)",
          ],
          groceries: [
            "Rotating protein sources: Grass-fed beef, wild salmon, free-range chicken (5-6 lbs total)",
            "Pasture-raised eggs (2-3 dozen)",
            "Organ meats (beef liver, heart - if tolerable)",
            "Healthy fats: Avocados, olives, coconut oil, olive oil",
            "Low-carb vegetables (5-6 different types, focusing on green vegetables)",
            "Berries (small amount)",
            "For refeed day: Sweet potatoes, white rice, bananas, honey",
          ],
          equipment: [
            "Foam roller for recovery",
            "Lacrosse ball for trigger point work",
            "Resistance bands for knee rehabilitation",
            "Wrist weights (1-2 lbs) for shadow boxing",
          ],
        };
      }
    } else if (currentPhase === 2) {
      return {
        supplements: [
          "Increased quantities of core supplements",
          "Beta-Alanine (200g container)",
          "Citrulline Malate (250g container)",
          "Ashwagandha (KSM-66 extract preferred)",
          "Whey protein isolate (5 lb container)",
          "Casein protein (for nighttime recovery)",
          "Tart cherry extract",
          "Electrolyte materials (salt, potassium chloride, magnesium)",
        ],
        groceries: [
          "Increased protein quantities (7-8 lbs total per week)",
          "Carbohydrate sources: White rice, sweet potatoes, potatoes",
          "Fruits: Berries, bananas (post-workout)",
          "Vegetables: Focus on variety and color (8-10 different types)",
          "Nuts and seeds (in moderation)",
          "Bone broth ingredients (for homemade)",
          "Coconut water (for post-training hydration)",
        ],
        equipment: [
          "Materials for DIY Bulgarian bag (duffel bag, sand/soil)",
          "Materials for homemade medicine ball",
          "Additional resistance bands of varying strengths",
          "Materials for contrast therapy setup improvements",
          "Percussion massage tool materials (attachment for jigsaw or equivalent)",
        ],
      };
    } else {
      return {
        supplements: [
          "Maintenance quantities of all previous supplements",
          "Exogenous ketones (BHB salts preferred)",
          "Turkesterone (if budget allows)",
          "L-Carnitine L-Tartrate",
          "Additional tart cherry extract",
          "Glycine powder",
          "Glucose powder (for post-workout nutrition)",
          "Curcumin with piperine (for inflammation management)",
        ],
        groceries: [
          "Premium protein sources (focus on variety and quality)",
          "Carbohydrate timing specifics: White rice, potatoes, honey",
          "Strategic carb-loading foods for high-carb day",
          "Increased vegetable variety (10+ types weekly)",
          "Strategic fruit selection for specific training windows",
          "Bone broth ingredients for daily consumption",
          "Electrolyte-rich foods (coconut water, celery, etc.)",
        ],
        equipment: [
          "Materials for advanced recovery setup",
          "Sleep optimization gear: Blackout materials, cooling systems",
          "Final knee rehabilitation equipment needs",
          "DIY equipment maintenance/replacement materials",
          "Fight simulation materials (mouthguard, etc. if moving toward actual competition)",
        ],
      };
    }
  };

  const getDailySchedule = () => {
    const isTrainingDay = currentDay % 7 !== 0; // Assuming Sunday is rest day

    if (isTrainingDay) {
      return [
        { time: "7:30 AM", activity: "Wake-up, Cold exposure, Mindset work" },
        {
          time: "8:30 AM",
          activity: "Mobility routine & Knee rehabilitation protocol",
        },
        {
          time: "9:00 AM",
          activity: "Conditioning workout followed by ice bath",
        },
        {
          time: "10:00 AM",
          activity:
            currentDay > 10
              ? "First meal (if feeding window)"
              : "Electrolytes + supplements",
        },
        { time: "12:00 PM", activity: "Shadow boxing & Technical development" },
        { time: "2:00 PM", activity: "Recovery protocols & Meditation" },
        {
          time: "4:00 PM",
          activity: "Main strength session & Power development",
        },
        {
          time: "6:00 PM",
          activity: "Final boxing session & Mental warfare training",
        },
        {
          time: "8:00 PM",
          activity:
            currentDay > 10
              ? "Strategic nutrition (if feeding window)"
              : "Recovery supplementation",
        },
        { time: "9:00 PM", activity: "Final knee rehab & Contrast therapy" },
        {
          time: "10:00 PM",
          activity: "Sleep preparation & Final mindset programming",
        },
        { time: "11:00 PM", activity: "Sleep" },
      ];
    } else {
      return [
        {
          time: "8:00 AM",
          activity: "Wake-up, Cold exposure, Extended mindset work",
        },
        {
          time: "9:00 AM",
          activity: "Extended mobility session & Injury prevention",
        },
        {
          time: "10:00 AM",
          activity: "Light active recovery & Technique study",
        },
        { time: "12:00 PM", activity: "Mental training & Visualization" },
        { time: "2:00 PM", activity: "Recovery modalities & Contrast therapy" },
        {
          time: "4:00 PM",
          activity: "Study fighting footage & Strategy development",
        },
        { time: "6:00 PM", activity: "Light skill practice & Balance work" },
        { time: "8:00 PM", activity: "Strategic nutrition & Supplementation" },
        { time: "9:00 PM", activity: "Final recovery protocols" },
        {
          time: "10:00 PM",
          activity: "Sleep preparation & Relaxation techniques",
        },
        { time: "11:00 PM", activity: "Sleep" },
      ];
    }
  };

  const getDailyChecklist = () => {
    const isTrainingDay = currentDay % 7 !== 0;
    const isPhase1Water = currentPhase === 1 && currentDay <= 5;
    const isPhase1Snake =
      currentPhase === 1 && currentDay > 5 && currentDay <= 10;

    const commonItems = [
      {
        id: "morning_mindset",
        text: "Morning mindset protocol completed",
        time: "7:30-8:00 AM",
      },
      {
        id: "knee_rehab_am",
        text: "Morning knee rehabilitation protocol",
        time: "8:30-9:00 AM",
      },
      {
        id: "cold_exposure",
        text: "Cold exposure protocol",
        time: "9:00-9:30 AM",
      },
      {
        id: "hydration_electrolytes",
        text: "Hydration & electrolytes (minimum 1 gallon)",
        time: "Throughout day",
      },
      {
        id: "supplements_am",
        text: "Morning supplements taken",
        time: "10:00 AM",
      },
      {
        id: "recovery_protocols",
        text: "Recovery protocols completed",
        time: "Variable",
      },
      {
        id: "evening_mindset",
        text: "Evening mindset & visualization",
        time: "10:00 PM",
      },
      {
        id: "sleep_optimization",
        text: "Sleep optimization setup",
        time: "10:30 PM",
      },
    ];

    const trainingDayItems = [
      {
        id: "conditioning_workout",
        text: "Conditioning workout completed",
        time: "9:00-10:00 AM",
      },
      {
        id: "technical_training",
        text: "Boxing technique session completed",
        time: "12:00-1:00 PM",
      },
      {
        id: "main_strength",
        text: "Main strength & power session",
        time: "4:00-5:30 PM",
      },
      {
        id: "evening_boxing",
        text: "Evening boxing & mental warfare training",
        time: "6:00-7:30 PM",
      },
      {
        id: "knee_rehab_pm",
        text: "Evening knee rehabilitation",
        time: "9:00-9:30 PM",
      },
    ];

    const restDayItems = [
      {
        id: "extended_mobility",
        text: "Extended mobility session completed",
        time: "9:00-10:00 AM",
      },
      {
        id: "active_recovery",
        text: "Light active recovery work",
        time: "10:00-11:00 AM",
      },
      {
        id: "mental_training",
        text: "Deep mental training & visualization",
        time: "12:00-1:00 PM",
      },
      {
        id: "contrast_therapy",
        text: "Complete contrast therapy session",
        time: "2:00-3:00 PM",
      },
      {
        id: "fight_study",
        text: "Study Tyson footage & strategy development",
        time: "4:00-5:00 PM",
      },
      { id: "light_skill", text: "Light skill practice", time: "6:00-7:00 PM" },
    ];

    // Nutrition items based on phase and day
    let nutritionItems = [];

    if (isPhase1Water) {
      nutritionItems = [
        {
          id: "morning_acv",
          text: "Morning ACV + salt water",
          time: "7:45 AM",
        },
        {
          id: "electrolyte_doses",
          text: "4 scheduled electrolyte doses",
          time: "Every 4 hours",
        },
        { id: "evening_mct", text: "Evening MCT oil dose", time: "8:00 PM" },
      ];
    } else if (isPhase1Snake) {
      const isFeedingDay = currentDay % 2 === 0;
      if (isFeedingDay) {
        nutritionItems = [
          {
            id: "bone_broth",
            text: "Breaking fast with bone broth",
            time: "5:00 PM",
          },
          { id: "meal_1", text: "First protein-focused meal", time: "5:30 PM" },
          { id: "meal_2", text: "Second complete meal", time: "7:00 PM" },
          {
            id: "final_meal",
            text: "Final nutritional intake",
            time: "8:30 PM",
          },
        ];
      } else {
        nutritionItems = [
          {
            id: "fasting_protocol",
            text: "Complete fasting (water + electrolytes only)",
            time: "All day",
          },
          {
            id: "electrolyte_doses",
            text: "Scheduled electrolyte doses",
            time: "Every 4 hours",
          },
        ];
      }
    } else {
      // For all other phases - add appropriate nutrition checklist items
      const mealPlan = getDailyNutritionPlan().mealPlan;

      if (typeof mealPlan === "string") {
        nutritionItems = [
          { id: "nutrition_protocol", text: mealPlan, time: "All day" },
        ];
      } else if (mealPlan.meals) {
        nutritionItems = mealPlan.meals.map((meal, index) => ({
          id: `meal_${index}`,
          text: `${meal.food}`,
          time: meal.time,
        }));
      }
    }

    return [
      ...commonItems,
      ...(isTrainingDay ? trainingDayItems : restDayItems),
      ...nutritionItems,
    ];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "schedule":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Day {currentDay} Schedule</CardTitle>
              <Description>
                {currentDay % 7 === 0 ? "REST DAY" : "TRAINING DAY"} Schedule
                for Phase {currentPhase}
              </Description>
            </CardHeader>
            {getDailySchedule().map((item, index) => (
              <ScheduleItem key={index}>
                <Time>{item.time}</Time>
                <Activity>{item.activity}</Activity>
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

            <DetailsButton onClick={() => toggleDetails("training")}>
              {showDetails["training"]
                ? "Hide Details"
                : "Show Detailed Instructions"}{" "}
              {showDetails["training"] ? "▲" : "▼"}
            </DetailsButton>

            {showDetails["training"] && (
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
            )}
          </Card>
        );
      case "nutrition":
        const nutritionPlan = getDailyNutritionPlan();
        return (
          <Card>
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

            <DetailsButton onClick={() => toggleDetails("nutrition")}>
              {showDetails["nutrition"]
                ? "Hide Details"
                : "Show Detailed Nutrition Plan"}{" "}
              {showDetails["nutrition"] ? "▲" : "▼"}
            </DetailsButton>

            {showDetails["nutrition"] && (
              <DetailSection>
                {/* Nutrition details */}
              </DetailSection>
            )}
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

            <DetailsButton onClick={() => toggleDetails("mindset")}>
              {showDetails["mindset"]
                ? "Hide Details"
                : "Show Mental Training Details"}{" "}
              {showDetails["mindset"] ? "▲" : "▼"}
            </DetailsButton>

            {showDetails["mindset"] && (
              <DetailSection>
                {/* Mindset details */}
              </DetailSection>
            )}
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

            <DetailsButton onClick={() => toggleDetails("supplements")}>
              {showDetails["supplements"]
                ? "Hide Details"
                : "Show Supplement Details"}{" "}
              {showDetails["supplements"] ? "▲" : "▼"}
            </DetailsButton>

            {showDetails["supplements"] && (
              <DetailSection>
                {/* Supplement details */}
              </DetailSection>
            )}
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

            <DetailsButton onClick={() => toggleDetails("recovery")}>
              {showDetails["recovery"]
                ? "Hide Details"
                : "Show Recovery Details"}{" "}
              {showDetails["recovery"] ? "▲" : "▼"}
            </DetailsButton>

            {showDetails["recovery"] && (
              <DetailSection>
                {/* Recovery details */}
              </DetailSection>
            )}
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
            {/* Shopping list content */}
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
            {/* Checklist content */}
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
