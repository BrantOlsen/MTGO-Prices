MTGO Pricing

- Gets data from https://mtgjson.com/sets.html and https://www.mtggoldfish.com/.

**How to Use**
- Edit /src/app/app.component.ts and add any sets to the AppComponent.sets list.
- Create a new binder with the cards you want to search for in MTGO and export as a .dek file.
- npm start to start the node server and go to localhost:3000.
- Click 'Load Set' then choose the exported file in the running app.

**Known Issues**
- MTGO does not export set information for cards, so the first set that has the card name in it will be used. Edit the AppComponent.sets list to ensure you find the right sets.
