package calculator

import (
	"encoding/json"
	"math"
	"os"
)

// Special Cases:
// Since lure has org change it's accuracy, the damage is accuracy for lure
//
//	so treat lure DAMAGE as lure ACCURACY
type Gag struct {
	GagType   string `json:"GagType"`
	GagName   string `json:"GagName"`
	Damage    int    `json:"Damage"`
	OrgDamage int    `json:"OrgDamage"`
	Accuracy  int    `json:"Accuracy"`
	Stun      int    `json:"Stun"`
	Shorthand string `json:"Shorthand"`
}

type Cog struct {
	health int
	level  int
	tier   int
	cheats []string
}

type BattleState struct {
	cog         Cog
	chanceToHit int
	timeToKill  float64
}

type Attack struct {
	gag         Gag
	isOrg       bool
	baseDamage  int
	totalDamage int
	lureDamage  int
	comboDamage int
	finalAcc    int
}

// Dict for holding gags
type GagDictionary map[string]Gag

var GagDict GagDictionary

// tgtDEF integers for acc calcs
// Tiny dictates defence for tier 1 cogs (flunkies)
const (
	DefLevel1     int = -2
	DefLevel2     int = -5
	DefLevel3     int = -10
	DefLevel4     int = -15
	DefLevel4Tiny int = -12
	DefLevel5     int = -20
	DefLevel5Tiny int = -15
	DefLevel6     int = -25
	DefLevel7     int = -30
	DefLevel8     int = -35
	DefLevel9     int = -40
	DefLevel10    int = -45
	DefLevel11    int = -50
	DefLevel12    int = -55
	DefLevel13    int = -60
	DefLevel14    int = -65
)

// atkAcc = propAcc + trackExp + tgtDef + bonus
var tgtDEF int

func CalculateDamage(isLured bool, trackEXP int, attacks []Attack, cog Cog) ([]Attack, BattleState) {
	// TODO implement TTK and Acc check (95%) for lure turn

	// Handle things decided in UI first
	// trackEXP - default to 70
	// 1 = 0, 2 = 10, ..., 7 = 60
	trackEXP = (trackEXP * 10) - 10

	// tgtDEF - default to lvl 12, tier 8
	tgtDEF := getTgtDEF(cog.level, cog.tier)

	// Bonus
	totalAcc := 100
	stun := 0
	var gagAcc int
	var gagDamage int
	var isTrapPlaced bool
	// Go through each gag individually to calc stun bonus
	for _, attack := range attacks {
		// determine chance for current gag to hit
		if isLured == false {
			// TODO Need to check for trap placement on group lure
			gagAcc = clampMax(getGagAccuracy(attack, isTrapPlaced)+trackEXP+tgtDEF+stun, 95)
		} else {
			if attack.gag.GagType == "Drop" {
				gagAcc = 0
			} else {
				gagAcc = 100
			}
		}

		// Update info for UI to display
		attack.finalAcc = gagAcc
		totalAcc *= gagAcc

		// Apply stun for next gags
		switch attack.gag.GagType {
		case "Trap":
			isTrapPlaced = true
		case "Lure":
			if isTrapPlaced {
				stun += GagDict["TNT"].Stun
			}
		default:
			stun += attack.gag.Stun
		}

		gagDamage = getGagDamage(attack, isLured)

		attack.baseDamage = gagDamage
	}

	return []Attack{}, BattleState{}
}

// TODO clamp to 0 too
func clampMax(x int, max int) int {
	if x > max {
		return max
	}
	return x
}

func getGagDamage(attack Attack, isLured bool) int {
	var gagDamage int
	// Calculate damage for current gag
	if attack.gag.GagType == "Lure" {
		gagDamage = 0
		isLured = true
	} else {
		if isLured {
			if attack.gag.GagType == "Drop" {
				gagDamage = 0
			} else if attack.gag.GagType == "Trap" {
				gagDamage = attack.gag.Damage
			} else {
				gagDamage = int(math.Ceil(float64(attack.gag.Damage) * 1.5))
			}
		} else {
			gagDamage = attack.gag.Damage
		}
	}

	return gagDamage
}

func getGagAccuracy(attack Attack, isTrapPlaced bool) int {
	var gagAcc int
	if attack.gag.GagType == "lure" {
		if attack.isOrg {
			gagAcc = attack.gag.OrgDamage
		} else {
			gagAcc = attack.gag.Damage
		}
		if isTrapPlaced {
			gagAcc += 10
		}
	} else {
		gagAcc = attack.gag.Accuracy
	}

	return gagAcc
}

// Run on launch so we don't have to constantly check json file
func LoadGags(filename string) (GagDictionary, error) {
	file, err := os.Open("data/gags.json")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var gags []Gag
	err = json.NewDecoder(file).Decode(&gags)

	for _, gag := range gags {
		GagDict[gag.GagName] = gag
	}

	return GagDict, err
}

// Believe me I wish this was a formula too
func getTgtDEF(level int, tier int) int {
	var tgtDEF int
	switch level {
	case 1:
		tgtDEF = DefLevel1
	case 2:
		tgtDEF = DefLevel2
	case 3:
		tgtDEF = DefLevel3
	case 4:
		if tier == 1 {
			tgtDEF = DefLevel4Tiny
		} else {
			tgtDEF = DefLevel4
		}
	case 5:
		if tier == 1 {
			tgtDEF = DefLevel5Tiny
		} else {
			tgtDEF = DefLevel5
		}
	case 6:
		tgtDEF = DefLevel6
	case 7:
		tgtDEF = DefLevel7
	case 8:
		tgtDEF = DefLevel8
	case 9:
		tgtDEF = DefLevel9
	case 10:
		tgtDEF = DefLevel10
	case 11:
		tgtDEF = DefLevel11
	case 12:
		tgtDEF = DefLevel12
	case 13:
		tgtDEF = DefLevel13
	default:
		tgtDEF = DefLevel14

	}

	return tgtDEF
}
