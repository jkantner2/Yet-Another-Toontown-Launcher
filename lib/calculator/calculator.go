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
	Gag   Gag
	IsOrg bool
}

type Cog struct {
	Level  int      `json:"level"`
	Tier   int      `json:"tier"`
	Cheats []string `json:"cheats"`
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

const TRAPSTUN int = 50

var gagOrder = map[string]int{
	"Toon-Up": 0,
	"Trap":    1,
	"Lure":    2,
	"Sound":   3,
	"Throw":   4,
	"Squirt":  5,
	"Drop":    6,
}

func IntoCalculateDamage(isLured bool, trackEXP int, attacks []AttackAnalysis, cog Cog) []AttackAnalysis {
	// Sort attacks by gagOrder
	sort.Slice(attacks, func(i, j int) bool {
		return gagOrder[attacks[i].Gag.GagType] < gagOrder[attacks[j].Gag.GagType]
	})

	// Set trackEXP to actual value
	trackEXP = (trackEXP - 1) * 10

	tgtDEF := getTgtDEF(cog.Level, cog.Tier)

	CalculateDamageRec(&attacks, 0, 0, isLured, trackEXP, tgtDEF, cog.Cheats)

	return attacks
}

func CalculateDamageRec(
	attacks *[]AttackAnalysis,
	i int,
	stun int,
	isLured bool,
	trackEXP int,
	tgtDEF int,
	cheats []string,
) {
	// Base case
	if i >= len(*attacks) {
		return
	}

	// Get surrounding gags unless nil
	var prevGag, nextGag *Gag
	if i < len(*attacks)-1 {
		nextGag = &(*attacks)[i+1].Gag
	}
	if i > 0 {
		prevGag = &(*attacks)[i-1].Gag
	}

	a := &(*attacks)[i]

	// Calc accuracy
	var gagAcc int
	switch {
	case isLured && a.Gag.GagType == "Drop":
		gagAcc = 0
	case isLured || a.Gag.GagType == "Trap":
		gagAcc = 100
	default:
		gagAcc = clampMax(getGagAccuracy(*a, (prevGag != nil && prevGag.GagType == "Trap"))+trackEXP+tgtDEF+stun, 95)
	}

	// Calc damage
	base, lure, combo := getGagDamage(*a, isLured, nextGag, prevGag)

	// Add info to list
	a.BaseDamage = base
	a.LureDamage = lure
	a.ComboDamage = combo
	a.TotalDamage = base + lure + combo
	a.FinalAcc = gagAcc

	// Change lure state
	isLured = a.Gag.GagType == "Lure" && (prevGag == nil || prevGag.GagType != "Trap")

	// Change stun state
	if prevGag == nil || prevGag.GagType != a.Gag.GagType {
		switch a.Gag.GagType {
		case "Lure":
			if prevGag != nil && prevGag.GagType == "Trap" {
				stun += TRAPSTUN
			}
		default:
			if a.Gag.GagType != "Trap" {
				stun += a.Gag.Stun
			}
		}
	}

	CalculateDamageRec(attacks, i+1, stun, isLured, trackEXP, tgtDEF, cheats)
}

// TODO clamp to 0 too
func clampMax(x int, max int) int {
	if x > max {
		return max
	}
	return x
}

func groupLure(attacks []AttackAnalysis) Gag {
	var lureGags []Gag

	for _, attack := range attacks {
		if attack.Gag.GagType == "Lure" {
			lureGags = append(lureGags, attack.Gag)
		}
	}


	return Gag{}
}

func getGagDamage(attack AttackAnalysis, isLured bool, nextGag *Gag, prevGag *Gag) (int, int, int) {
	g := attack.Gag
	gagType := g.GagType
	gagDamage, lureDamage, comboDamage := 0, 0, 0
	hasCombo := adjacentSameType(nextGag, prevGag, gagType)

	// Calculate damage for current gag
	// Lure deals no damage
	if gagType == "Lure" {
		return 0, 0, 0
	}

	// Trap deals none if multiple on cog
	if gagType == "Trap" && adjacentSameType(nextGag, prevGag, gagType) {
		return 0, 0, 0
	}

	if gagType == "Trap" && nextGag == nil {
		return 0, 0, 0
	}

	// TODO: Change base damage based on cheats here
	baseDamage := g.Damage
	if attack.IsOrg {
		baseDamage = g.OrgDamage
	}

	switch {
	// Drop on lured cog
	case isLured && gagType == "Drop":
		gagDamage = 0
	// Lure after trap placed
	case gagType == "Trap" && nextGag != nil && nextGag.GagType == "Lure":
		gagDamage = baseDamage
	// Sound on lured cog
	case isLured && gagType == "Sound":
		gagDamage = baseDamage
	// Lured on Throw, Squirt, Sound
	case isLured:
		lureDamage = int(math.Ceil(float64(baseDamage) * 0.5))
		if hasCombo {
			comboDamage = int(math.Ceil(float64(baseDamage)) * 0.2)
		}
		gagDamage = baseDamage
	// No funny buisiness
	default:
		if hasCombo {
			comboDamage = int(math.Ceil(float64(baseDamage)) * 0.2)
		}
		gagDamage = baseDamage
	}

	return gagDamage, lureDamage, comboDamage
}

func getGagAccuracy(attack AttackAnalysis, isTrapPlaced bool) int {
	g := attack.Gag

	if g.GagType != "Lure" {
		return g.Accuracy
	}

	acc := g.Damage
	if attack.IsOrg {
		acc = g.OrgDamage
	}
	if isTrapPlaced {
		acc += 10
	}

	return acc
}

func adjacentSameType(nextGag, prevGag *Gag, typ string) bool {
	if nextGag != nil && nextGag.GagType == typ {
		return true
	}
	if prevGag != nil && prevGag.GagType == typ {
		return true
	}
	return false
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
