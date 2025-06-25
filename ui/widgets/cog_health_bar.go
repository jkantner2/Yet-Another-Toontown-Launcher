package widgets

import "fyne.io/fyne/v2/widget"

// TODO
type CogHealthBar struct {
	widget.BaseWidget

	Value 		int 		// Damage dealt in calc
	levelHealth 	map[int]int 	// Health of each level (12, 196)
	Max 		int 		// Highest health of any cog (476)
}
