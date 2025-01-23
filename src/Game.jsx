import React, { useState, useEffect } from "react";
import "./Game.css";

// Import images
import polloImg from "./pollo.png";
import varitaImg from "./varita.png";
import espadaImg from "./espada.png";
import picoImg from "./pico.png";
import anilloImg from "./anillo.png";
import libroImg from "./libro.png";
import gemaImg from "./gema.png";
import capaImg from "./capa.png";
import sombreroImg from "./sombrero.png";
import cascoImg from "./casco.png";
import armorImg from "./armor.png";
import legsImg from "./legs.png";
import potionImg from "./potion.png";
import coinImg from "./coin.png";
import characterImg from './character.png';

const Game = () => {
  const [character, setCharacter] = useState({
    hp: 100,
    maxHp: 100,
    stamina: 10,
    strength: 10,
    agility: 10,
    intelligence: 10,
    luck: 10,
    level: 1,
    exp: 0,
    nextLevelExp: 100,
    goldCoins: 0,
    statPoints: 0,
    inventory: [],
    equipment: {
      helmet: null,
      armor: null,
      legs: null,
      boots: null,
      leftHand: null,
      rightHand: null,
    },
  });

  const [missionResult, setMissionResult] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const [easyMissionCooldown, setEasyMissionCooldown] = useState(0);
  const [hardMissionCooldown, setHardMissionCooldown] = useState(0);

  useEffect(() => {
    const healInterval = setInterval(() => {
      setCharacter((prev) => ({
        ...prev,
        hp: Math.min(prev.hp + 10, prev.maxHp),
      }));
    }, 10000);

    return () => clearInterval(healInterval);
  }, []);

  useEffect(() => {
    const easyCooldownInterval = setInterval(() => {
      if (easyMissionCooldown > 0) {
        setEasyMissionCooldown((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(easyCooldownInterval);
  }, [easyMissionCooldown]);

  useEffect(() => {
    const hardCooldownInterval = setInterval(() => {
      if (hardMissionCooldown > 0) {
        setHardMissionCooldown((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(hardCooldownInterval);
  }, [hardMissionCooldown]);

  const gainExp = (exp) => {
    let newExp = character.exp + exp;
    let newLevel = character.level;
    let newNextLevelExp = character.nextLevelExp;

    while (newExp >= newNextLevelExp) {
      newExp -= newNextLevelExp;
      newLevel++;
      newNextLevelExp = Math.floor(newNextLevelExp * 1.2);
      setCharacter((prev) => ({
        ...prev,
        statPoints: prev.statPoints + 5,
      }));
    }

    setCharacter((prev) => ({
      ...prev,
      exp: newExp,
      level: newLevel,
      nextLevelExp: newNextLevelExp,
    }));
  };

  const goOnMission = () => {
    if (easyMissionCooldown > 0) return;

    const isSuccess = Math.random() < 0.7; // 70% chance of success
    if (isSuccess) {
      const reward = Math.random();
      let newItem = "";
      if (reward < 0.1) newItem = "Potion";
      else if (reward < 0.2) newItem = "Sword";
      else if (reward < 0.3) newItem = "Shield";
      else if (reward < 0.4) newItem = "Helmet";
      else if (reward < 0.5) newItem = "Armor";
      else if (reward < 0.6) newItem = "Legs";
      else if (reward < 0.7) newItem = "Boots";
      else if (reward < 0.8) newItem = "Wand";
      else if (reward < 0.9) newItem = "Ring";
      else newItem = "Book";

      setCharacter((prev) => ({
        ...prev,
        goldCoins: prev.goldCoins + 10,
        inventory: newItem !== "Nothing" ? [...prev.inventory, newItem] : prev.inventory,
      }));

      gainExp(50);
      setMissionResult(`Mission Success! You gained 10 gold coins and ${newItem}.`);
    } else {
      setCharacter((prev) => ({
        ...prev,
        hp: Math.max(prev.hp - 30, 0),
      }));
      setMissionResult("Mission Failed! You lost 30 HP.");
    }

    setEasyMissionCooldown(5); // 5-second cooldown
  };

  const goOnHardMission = () => {
    if (hardMissionCooldown > 0) return;

    const isSuccess = Math.random() < 0.3; // 30% chance of success
    if (isSuccess) {
      const reward = Math.random();
      let newItem = "";
      if (reward < 0.2) newItem = "Armor";
      else if (reward < 0.4) newItem = "Helmet";
      else if (reward < 0.6) newItem = "Legs";
      else if (reward < 0.8) newItem = "Boots";
      else newItem = "Gem";

      setCharacter((prev) => ({
        ...prev,
        goldCoins: prev.goldCoins + 20,
        inventory: newItem !== "Nothing" ? [...prev.inventory, newItem] : prev.inventory,
      }));

      gainExp(100);
      setMissionResult(`Hard Mission Success! You gained 20 gold coins and ${newItem}.`);
    } else {
      setCharacter((prev) => ({
        ...prev,
        hp: Math.max(prev.hp - 60, 0),
      }));
      setMissionResult("Hard Mission Failed! You lost 60 HP.");
    }

    setHardMissionCooldown(20); // 20-second cooldown
  };

  const useItem = (item) => {
    if (item === "Potion") {
      setCharacter((prev) => ({
        ...prev,
        hp: Math.min(prev.hp + 25, prev.maxHp),
      }));
      setCharacter((prev) => ({
        ...prev,
        inventory: prev.inventory.filter((i, index) => index !== prev.inventory.indexOf(item)),
      }));
    }
  };

  const equipItem = (item, slot) => {
    if (isValidSlot(item, slot)) {
      setCharacter((prev) => ({
        ...prev,
        equipment: { ...prev.equipment, [slot]: item },
        inventory: prev.inventory.filter((i, index) => index !== prev.inventory.indexOf(item)),
      }));
    }
  };

  const unequipItem = (slot) => {
    const item = character.equipment[slot];
    if (item) {
      setCharacter((prev) => ({
        ...prev,
        equipment: { ...prev.equipment, [slot]: null },
        inventory: [...prev.inventory, item],
      }));
    }
  };

  const isValidSlot = (item, slot) => {
    const validSlots = {
      Helmet: ["helmet"],
      Armor: ["armor"],
      Legs: ["legs"],
      Boots: ["boots"],
      Sword: ["leftHand", "rightHand"],
      Shield: ["leftHand", "rightHand"],
      Wand: ["leftHand", "rightHand"],
      Ring: ["leftHand", "rightHand"],
      Book: ["leftHand", "rightHand"],
    };

    return validSlots[item]?.includes(slot);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDrop = (e, slot) => {
    e.preventDefault();
    if (draggedItem && isValidSlot(draggedItem, slot)) {
      // Unequip the item from its current slot if it's already equipped
      const currentSlot = Object.keys(character.equipment).find(
        (key) => character.equipment[key] === draggedItem
      );
      if (currentSlot) {
        unequipItem(currentSlot);
      }
      equipItem(draggedItem, slot);
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getItemImage = (item) => {
    switch (item) {
      case "Potion":
        return potionImg;
      case "Sword":
        return espadaImg;
      case "Shield":
        return cascoImg;
      case "Helmet":
        return sombreroImg;
      case "Armor":
        return armorImg;
      case "Legs":
        return legsImg;
      case "Boots":
        return capaImg;
      case "Wand":
        return varitaImg;
      case "Ring":
        return anilloImg;
      case "Book":
        return libroImg;
      case "Gem":
        return gemaImg;
      default:
        return null;
    }
  };

  const spendStatPoint = (stat) => {
    if (character.statPoints > 0 && character[stat] < 30) {
      setCharacter((prev) => ({
        ...prev,
        [stat]: prev[stat] + 1,
        statPoints: prev.statPoints - 1,
      }));
    }
  };

  return (
    <div className="game-container">
      <div className="main-content">
        <div className="left-panel">
          <div className="character-section">
            <img src={characterImg} alt="Character" className="character-image" />
            <div className="stats">
              <h1>Character Game</h1>
              <h2>Stats</h2>
              <p>Level: {character.level}</p>
              <div className="stat-row">
                <p>HP: {character.hp} / {character.maxHp}</p>
                <div className="bar hp-bar">
                  <div style={{ width: `${(character.hp / character.maxHp) * 100}%` }}></div>
                </div>
              </div>
              <div className="stat-row">
                <p>XP: {character.exp} / {character.nextLevelExp}</p>
                <div className="bar xp-bar">
                  <div style={{ width: `${(character.exp / character.nextLevelExp) * 100}%` }}></div>
                </div>
              </div>
              <div className="stat-row">
                <p>Stamina: {character.stamina}</p>
                <div className="bar stat-bar">
                  <div style={{ width: `${(character.stamina / 30) * 100}%` }}></div>
                </div>
                <button className="stat-button" onClick={() => spendStatPoint("stamina")}>+</button>
              </div>
              <div className="stat-row">
                <p>Strength: {character.strength}</p>
                <div className="bar stat-bar">
                  <div style={{ width: `${(character.strength / 30) * 100}%` }}></div>
                </div>
                <button className="stat-button" onClick={() => spendStatPoint("strength")}>+</button>
              </div>
              <div className="stat-row">
                <p>Agility: {character.agility}</p>
                <div className="bar stat-bar">
                  <div style={{ width: `${(character.agility / 30) * 100}%` }}></div>
                </div>
                <button className="stat-button" onClick={() => spendStatPoint("agility")}>+</button>
              </div>
              <div className="stat-row">
                <p>Intelligence: {character.intelligence}</p>
                <div className="bar stat-bar">
                  <div style={{ width: `${(character.intelligence / 30) * 100}%` }}></div>
                </div>
                <button className="stat-button" onClick={() => spendStatPoint("intelligence")}>+</button>
              </div>
              <div className="stat-row">
                <p>Luck: {character.luck}</p>
                <div className="bar stat-bar">
                  <div style={{ width: `${(character.luck / 30) * 100}%` }}></div>
                </div>
                <button className="stat-button" onClick={() => spendStatPoint("luck")}>+</button>
              </div>
              <p>Gold Coins: {character.goldCoins}</p>
              <p>Stat Points: {character.statPoints}</p>
            </div>
          </div>
          <div className="missions-section">
            <h2>Missions</h2>
            <button onClick={goOnMission} disabled={easyMissionCooldown > 0}>
              Go on Mission {easyMissionCooldown > 0 ? `(${easyMissionCooldown}s)` : ""}
            </button>
            <button onClick={goOnHardMission} disabled={hardMissionCooldown > 0}>
              Go on Hard Mission {hardMissionCooldown > 0 ? `(${hardMissionCooldown}s)` : ""}
            </button>
            <p>{missionResult}</p>
          </div>
        </div>
        <div className="right-panel">
        <div className="equipment-section">
            <h2>Equipment</h2>
            <div className="equipment-grid">
              <div className="equipment-slot helmet" onDrop={(e) => handleDrop(e, "helmet")} onDragOver={handleDragOver}>
                {character.equipment.helmet ? (
                  <img
                    src={getItemImage(character.equipment.helmet)}
                    alt={character.equipment.helmet}
                    draggable
                    onDragStart={(e) => handleDragStart(e, character.equipment.helmet)}
                    onClick={() => unequipItem("helmet")}
                  />
                ) : (
                  <span>Helmet</span>
                )}
              </div>
              <div className="equipment-slot left-hand" onDrop={(e) => handleDrop(e, "leftHand")} onDragOver={handleDragOver}>
                {character.equipment.leftHand ? (
                  <img
                    src={getItemImage(character.equipment.leftHand)}
                    alt={character.equipment.leftHand}
                    draggable
                    onDragStart={(e) => handleDragStart(e, character.equipment.leftHand)}
                    onClick={() => unequipItem("leftHand")}
                  />
                ) : (
                  <span>Left Hand</span>
                )}
              </div>
              <div className="equipment-slot armor" onDrop={(e) => handleDrop(e, "armor")} onDragOver={handleDragOver}>
                {character.equipment.armor ? (
                  <img
                    src={getItemImage(character.equipment.armor)}
                    alt={character.equipment.armor}
                    draggable
                    onDragStart={(e) => handleDragStart(e, character.equipment.armor)}
                    onClick={() => unequipItem("armor")}
                  />
                ) : (
                  <span>Armor</span>
                )}
              </div>
              <div className="equipment-slot right-hand" onDrop={(e) => handleDrop(e, "rightHand")} onDragOver={handleDragOver}>
                {character.equipment.rightHand ? (
                  <img
                    src={getItemImage(character.equipment.rightHand)}
                    alt={character.equipment.rightHand}
                    draggable
                    onDragStart={(e) => handleDragStart(e, character.equipment.rightHand)}
                    onClick={() => unequipItem("rightHand")}
                  />
                ) : (
                  <span>Right Hand</span>
                )}
              </div>
              <div className="equipment-slot legs" onDrop={(e) => handleDrop(e, "legs")} onDragOver={handleDragOver}>
                {character.equipment.legs ? (
                  <img
                    src={getItemImage(character.equipment.legs)}
                    alt={character.equipment.legs}
                    draggable
                    onDragStart={(e) => handleDragStart(e, character.equipment.legs)}
                    onClick={() => unequipItem("legs")}
                  />
                ) : (
                  <span>Legs</span>
                )}
              </div>
              <div className="equipment-slot boots" onDrop={(e) => handleDrop(e, "boots")} onDragOver={handleDragOver}>
                {character.equipment.boots ? (
                  <img
                    src={getItemImage(character.equipment.boots)}
                    alt={character.equipment.boots}
                    draggable
                    onDragStart={(e) => handleDragStart(e, character.equipment.boots)}
                    onClick={() => unequipItem("boots")}
                  />
                ) : (
                  <span>Boots</span>
                )}
              </div>
            </div>
          </div>
          <div className="inventory-section">
            <h2>Inventory (8x4)</h2>
            <div className="inventory-grid">
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="inventory-slot">
                  {character.inventory[index] && (
                    <img
                      src={getItemImage(character.inventory[index])}
                      alt={character.inventory[index]}
                      draggable
                      onDragStart={(e) => handleDragStart(e, character.inventory[index])}
                      onClick={() => useItem(character.inventory[index])}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;