package calculator

// Special Cases:
// Since lure has org change it's accuracy, the damage is accuracy for lure
//  so treat lure DAMAGE as lure ACCURACY
type Gag struct {
	GagType   string `json:"GagType"`
	GagName   string `json:"GagName"`
	Damage    int    `json:"Damage"`
	OrgDamage int    `json:"OrgDamage"`
	Accuracy  int    `json:"Accuracy"`
	Stun      int    `json:"Stun"`
	Shorthand string `json:"Shorthand"`
}

// Dict for holding gags
type GagDictionary map[string]Gag
