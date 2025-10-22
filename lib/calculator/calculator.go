package calculator

import (
	"math"
	"sort"
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
	Resource  string `json:"Resource"`
}

type GagAttack struct {
	Gag Gag
	IsOrg bool
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

type AttackAnalysis struct {
	Gag         Gag
	IsOrg       bool
	BaseDamage  int
	TotalDamage int
	LureDamage  int
	ComboDamage int
	FinalAcc    int
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

var gagOrder = map[string]int{
	"Toon-Up": 0,
	"Trap": 1,
	"Lure": 2,
	"Sound": 3,
	"Throw": 4,
	"Squirt": 5,
	"Drop": 6,
}


// atkAcc = propAcc + trackExp + tgtDef + bonus
func CalculateDamage(isLured bool, trackEXP int, attacks []AttackAnalysis, cog Cog) ([]AttackAnalysis) {
	// TODO: implement TTK and Acc check (95%) for lure turn

	// Sort input gags
	sort.Slice(attacks, func(i, j int) bool {
		return gagOrder[attacks[i].Gag.GagType] < gagOrder[attacks[j].Gag.GagType]
	})

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
	for i := range attacks {
		// determine chance for current gag to hit
		if isLured == false {
			// TODO Need to check for trap placement on group lure
			gagAcc = clampMax(getGagAccuracy(attacks[i], isTrapPlaced)+trackEXP+tgtDEF+stun, 95)
		} else {
			if attacks[i].Gag.GagType == "Drop" {
				gagAcc = 0
			} else {
				gagAcc = 100
			}
		}

		// Update info for UI to display
		attacks[i].FinalAcc = gagAcc
		totalAcc *= gagAcc

		// Apply stun for next gags
		switch attacks[i].Gag.GagType {
		case "Trap":
			isTrapPlaced = true
		case "Lure":
			if isTrapPlaced {
				stun += GagDict["TNT"].Stun
			}
		default:
			stun += attacks[i].Gag.Stun
		}

		gagDamage = getGagDamage(attacks[i], isLured)

		attacks[i].BaseDamage = gagDamage
	}

	return attacks
}

// TODO clamp to 0 too
func clampMax(x int, max int) int {
	if x > max {
		return max
	}
	return x
}

func getGagDamage(attack AttackAnalysis, isLured bool) int {
	var gagDamage int
	// Calculate damage for current gag
	if attack.Gag.GagType == "Lure" {
		gagDamage = 0
	} else {
		if isLured {
			switch attack.Gag.GagType {
			case "Drop":
				gagDamage = 0
			case "Trap":
				gagDamage = attack.Gag.Damage
			default:
				gagDamage = int(math.Ceil(float64(attack.Gag.Damage) * 1.5))
			}
		} else {
			gagDamage = attack.Gag.Damage
		}
	}
	return gagDamage
}

func getGagAccuracy(attack AttackAnalysis, isTrapPlaced bool) int {
	var gagAcc int
	if attack.Gag.GagType == "lure" {
		if attack.IsOrg {
			gagAcc = attack.Gag.OrgDamage
		} else {
			gagAcc = attack.Gag.Damage
		}
		if isTrapPlaced {
			gagAcc += 10
		}
	} else {
		gagAcc = attack.Gag.Accuracy
	}

	return gagAcc
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
	case 14:
		tgtDEF = DefLevel13
	default:
		tgtDEF = DefLevel14

	}

	return tgtDEF
}
