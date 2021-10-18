// ⚡️ Fiber is an Express inspired web framework written in Go with ☕️
// 🤖 Github Repository: https://github.com/gofiber/fiber
// 📌 API Documentation: https://docs.gofiber.io

package main

import (
	"encoding/json"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func init() {
	//TODO: Load other .env file rather than this new one with the same info
	if err := godotenv.Load(); err != nil {
		log.Fatalln("No .env file found")
	}
}

func main() {
	app := fiber.New()

	//TODO: ensure this is an authenticated route
	app.Post("/addbookmark", addBookmark)

	app.Listen(":3001")
}

func addBookmark(c *fiber.Ctx) error {
	var result []byte
	var err error
	b := new(Bookmark)

	if err := c.BodyParser(b); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	if err := b.scrapeUrl(); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	db := connectDb(b.Token)

	if b.FolderId > 0 {
		result, err = db.From("bookmarks").Insert(
			map[string]interface{}{"url": b.Url, "user_id": b.UserId, "title": b.Title, "description": b.Description, "image": b.Image, "icon": b.Icon, "folder_id": b.FolderId}, false, "undefined", "representation", "null").Execute()
	} else {
		result, err = db.From("bookmarks").Insert(
			map[string]interface{}{"url": b.Url, "user_id": b.UserId, "title": b.Title, "description": b.Description, "image": b.Image, "icon": b.Icon}, false, "undefined", "representation", "null").Execute()
	}

	if err != nil {
		return c.Status(400).SendString(err.Error())
	}

	if db.ClientError != nil {
		log.Println(db.ClientError.Error())
	}

	var r []interface{}
	if err := json.Unmarshal(result, &r); err != nil {
		return c.Status(400).SendString(err.Error())
	}
	return c.JSON(r)
}
