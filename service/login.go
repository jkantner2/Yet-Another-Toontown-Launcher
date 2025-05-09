package service

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
)

const loginURL = "https://www.toontownrewritten.com/api/login?format=json"

type TTRResponse struct {
	Success      	string `json:"success"`
	Banner       	string `json:"banner,omitempty"`
	ResponseToken 	string `json:"responseToken,omitempty"`
	Gameserver   	string `json:"gameserver,omitempty"`
	Cookie    	string `json:"cookie,omitempty"`
	Manifest     	string `json:"manifest,omitempty"`
	ETA          	string `json:"eta,omitempty"`
	Position     	string `json:"position,omitempty"`
	QueueToken   	string `json:"queueToken,omitempty"`
}

func LoginTTR(username string, password string) (*TTRResponse, error) {
	// Create form to send
	form := url.Values{}
	form.Set("username", username)
	form.Set("password", password)

	// Create POST Request
	req, err := http.NewRequest(http.MethodPost, loginURL, bytes.NewBufferString(form.Encode()))

	// Add required Header
	req.Header.Set("Content-type", "application/x-www-form-urlencoded")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	// Gather & return response
	body, _ := io.ReadAll(resp.Body)

	var ttrResp TTRResponse
	if err := json.Unmarshal(body, &ttrResp); err != nil {
		return nil, err
	}

	return &ttrResp, nil
}
