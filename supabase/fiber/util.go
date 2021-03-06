package main

import (
	"fmt"
	"log"
	"net/url"
	"os"

	"github.com/supabase/postgrest-go"
)

// relateUrl checks if a string is a valid URL, and if not, assumes it is relative to the parent.
func relateUrl(parent, child string) string {
	if _, err := url.Parse(child); err != nil {
		child = fmt.Sprintf("%s/%s", parent, child)
	}
	return child
}

func connectDb(token string) *postgrest.Client {
	accessToken := fmt.Sprintf("Bearer %s", token)
	apiKey := os.Getenv("ANON_KEY")

	db := postgrest.NewClient("http://rest:3000/", "", map[string]string{"apikey": apiKey, "authorization": accessToken})
	if db.ClientError != nil {
		log.Panicln(db.ClientError)
	}
	return db
}
