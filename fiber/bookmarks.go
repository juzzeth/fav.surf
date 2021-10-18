package main

import (
	"log"

	"github.com/badoux/goscraper"
)

type Bookmark struct {
	Id          string `json:"id"`
	Url         string `json:"url"`
	UserId      string `json:"user_id"`
	FolderId    int    `json:"folder_id"`
	Title       string `json:"title"`
	Favourite   bool   `json:"favourite"`
	Description string `json:"description"`
	Image       string `json:"image"`
	Icon        string `json:"icon"`
	Name        string `json:"name"`
	Token       string `json:"access_token"`
}

type Bookmarks struct {
	Bookmarks []Bookmark `json:"bookmarks"`
}

func (b *Bookmark) scrapeUrl() error {
	// IMPORTANT TODO: Need to implement some security such that a malicious actor couldn't request local information or services
	//TODO: Save images in Supabase storage
	//TODO: Archive copies of websites (version history)
	s, err := goscraper.Scrape(b.Url, 1)
	if err != nil {
		return err
	}
	log.Printf("Scraping URL: %s\n", b.Url)

	b.Icon = relateUrl(b.Url, s.Preview.Icon)
	b.Name = s.Preview.Name
	b.Title = s.Preview.Title
	//TODO: check for more images, allow a choice
	if len(s.Preview.Images) > 0 {
		b.Image = relateUrl(b.Url, s.Preview.Images[0])
	}
	b.Description = s.Preview.Description

	return err
}
