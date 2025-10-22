package services

import (
	"YATL/lib/calculator"
)

type CalculatorService struct{}

func (g *CalculatorService) CalculateAttacks(gags[] calculator.GagAttack, isLured bool, cog calculator.Cog) []calculator.AttackAnalysis {
	attacks := make([]calculator.AttackAnalysis, len(gags))

	for i, gag := range gags {
		attacks[i] = calculator.AttackAnalysis{Gag: gag.Gag, IsOrg: gag.IsOrg}
	}

	return calculator.CalculateDamage(isLured, 7, attacks, cog)
}
