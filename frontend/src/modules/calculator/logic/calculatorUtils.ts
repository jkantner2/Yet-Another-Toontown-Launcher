import { CalculateAttacks } from "../../../../bindings/YATL/services/calculatorservice";
import { AttackAnalysis } from "../../../../bindings/YATL/src/calculator/models";
import { CalcState } from "../hooks/useCalculator";
import { StatusName } from "./types";

export async function calculateAnalyzedAttacks(state: CalcState): Promise<AttackAnalysis[]> {
  const res = await CalculateAttacks(state.selectedGags, state.isLured, {
    boilerLevel: state.boilerLevel,
    level: Number(state.cogLevel),
    tier: 8,
    cheats: Object.values(StatusName).filter((status) => state.checkedStatuses[status] === true)
  })

  return res;
}

export function addDamageNumbers(attacks: AttackAnalysis[]): number {
  let totalDamage = 0,
    totalBaseDamage = 0,
    totalLureDamage = 0,
    totalComboDamage = 0

  totalBaseDamage = Math.ceil(attacks.reduce((total, atk) => total + atk.BaseDamage, 0))
  totalLureDamage = Math.ceil(attacks.reduce((total, atk) => total + atk.LureDamage, 0))
  totalComboDamage = Math.ceil(attacks.reduce((total, atk) => total + atk.ComboDamage, 0))

  totalDamage = totalBaseDamage + totalLureDamage + totalComboDamage
  return Math.ceil(totalDamage)

}

export function calculateAccuracy(attacks: AttackAnalysis[]): number {
  return Number(attacks
    .filter(
      (atk, index, self) =>
        self.findIndex((a) => a.Gag.GagType === atk.Gag.GagType) === index
    )
    .reduce((total, atk) => total * atk.FinalAcc * 0.01, 100)
    .toFixed(2)
  )
}

export function getCogHealthModifier(statuses: Record<StatusName, boolean>) {
    let checked = Object.values(StatusName).filter((status) => statuses[status] === true)
    let modifier = 0;

    checked.forEach(status => {
      switch (status) {
        case StatusName.OverPaidCoin:
          modifier += 150
          break;
        case StatusName.OverPaidBullion:
          modifier += 200
          break;
      }
    })

    return modifier
}
