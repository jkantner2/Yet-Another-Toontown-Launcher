package ttrapi

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

type ttrApiCall string

const (
	Toon      ttrApiCall = "toon.json"
	Laff      ttrApiCall = "laff.json"
	Location  ttrApiCall = "location.json"
	Gags      ttrApiCall = "gags.json"
	Tasks     ttrApiCall = "tasks.json"
	Invasion  ttrApiCall = "invasion.json"
	Fish      ttrApiCall = "fish.json"
	Flowers   ttrApiCall = "flowers.json"
	CogSuits  ttrApiCall = "cogsuits.json"
	Golf      ttrApiCall = "golf.json"
	Racing    ttrApiCall = "racing.json"
	Beans     ttrApiCall = "beans.json"
	Rewards   ttrApiCall = "rewards.json"
	Cattlelog ttrApiCall = "cattlelog.json"
)

func (c ttrApiCall) isValid() bool {
	switch c {
	case Toon, Laff, Location, Gags, Tasks, Invasion,
		Fish, Flowers, CogSuits, Golf, Racing, Beans,
		Rewards, Cattlelog:
		return true
	default:
		return false
	}
}

// CallLocalApi calls api on instance running locally
// Returns raw JSON
func CallLocalApi(port int, call ttrApiCall) ([]byte, error) {
	if !call.isValid() {
		return nil, fmt.Errorf("Invalid TTR API Call")
	}
	url := fmt.Sprintf("http://localhost:%d/%s", port, call)

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	req.Host = fmt.Sprintf("localhost:%d", port)
	req.Header.Add("Authorization", os.Getenv("TTR_AUTH_HEADER"))
	req.Header.Add("User-Agent", "Yet Another Toontown Launcher")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	return body, nil
}
