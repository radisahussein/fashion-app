# The Problem
Sometimes I have issues choosing what to wear when planning for my outfit of the day. I would forget what I've worn for the week, and would sometimes repeat an outfit I've worn before. I've also been losing clothing items in the laundry when using a laundry service. 

## Pain Points:
- Don't know what to wear when planning for daily outfits
- Forgot important pieces that I would normally wear (like a checklist of items I have to wear. Eg: hats, rings, jewelries, etc.)
- Would forget outfit sets / items I've worn recently, causing re-use
- Lose track of items left at laundry service, causing lost items


# The Solution
An all-purpose application to cater to my fashion needs. 

## Functions:
- Track outfits I've worn each day (through photo / manual entry).
- Dashboard to show statistics about recent outfits, most worn items, least worn items, etc.
- Stock Page to list down all the items I have, include option to additonal data such as pictures, date of purchase, where it was bought, size, color, etc.
- Curated List to list down things I need as essentials, or combinations. Eg: I need at least 1 accessory every outfit, I want at least 3 different colors in each outfit, etc.
- Track items at laundry, ensure every item I sent comes back and in the same/good condition.

## High-level Flow/Design
1. Home Page: Shows simple statistics such as yesterday's outfit, suggestions for today's outfit, reminders of least worn items, number of items still in laundry, etc.
2. Stock/Closet Page:
    - Users can input items in their closet, along with descriptions
    - Users can view items in their closet, add, edit, and remove
    - Items in laundry will have an clear visual indicator, indicating not available due to laundry.
3. Lookbook Page:
    - Users can create unique sets of outfits that they like the most
    - Users can create requirements on things they need in an outfit (eg: need at least 1 accessories, need at least 3 different colors, textures, etc.)
    - Users can view their lookbook, add, edit, and remove
    - Lookbooks will preview items put together, if users have pictures for them. App must be able to edit the image to PNG for seamless lookbook view
4. Outfit Log Page: 
    - Users are able to log their daily outfits, either with picture or by manual selectors based on the items in their closet
    - Users can input additional details such as the occasion for the day (festival, campus, work, etc.)
    - Users can "rate" their outfit for future reference. 
    - Users can view what they wore historically.
5. Statistics Page:
    - More detailed page for all statistics, most worn outfits, least worn outfits, most worn items, least worn items, etc.
    - Able to discern underlying statistics regarding the user's outfits. Eg: User seems to prefer green in their outfits, as observed by their last 3 outfits
6. Laundry Tracker:
    - Users able to create laundry session, inputting items that are being sent to laundry from the Closet items. 
    - Users set details to laundry session such as laundry start date, end date(optional), laundry location/name, price, total weight
    - Users able to see ongoing laundry sessions, which items are in laundry. 
    - Users are able to end a laundry session, by taking stock of which items are received back. 
        - If all items got back safely, show a visual indicator in the session such as green overlay or something else
        - If some items are missing, show visual indicator in the session such as red/orange overlay

# Technical Requirements
- Must be a lightweight app
- Deployed to Vercel, free version, using Github integration
- Implement CI/CD using Husky for tests
- Supabase free tier for database
- Usage will be using Iphone's bookmark feature (Navigate to web page, and bookmarking it creates an icon in my homescreen)
- Use simple authentication, the only user will be me and my friend. 

# Required Tech Stack
- Deployment: Vercel
- NextJS
- Supabase

Feel free to define the best technology for other requirements. Ensure it follows the technical requirements.

# Success Criteria
- Able to navigate, open, and interact with the page using any device, laptop, phone, etc.
- Able to seamlessly input data regarding outfits.
- Able to suggest or remind me of outfits I've worn too much, or outfits I haven't been wearing recently.
- Able to track statistics on my outfit usages.
- Able to keep track of my items that are sent to laundry.

# Additional Notes
- Do NOT overcomplicate this app, it is only a simple, personal project application to help solve my pain points.
- There are no future plans for scaling, this app will only be for personal use, with at most, 5 users.
- Do NOT create large and big codes that are unneccessary, keep everything simple.
- Always adhere to DRY, KISS, YAGNI
- Follow industry standards and best practices. 
- Heavy security is not needed, a simple security/protection layer is enough.
- Keep every function short and simple, split up big functions into multiple modular functions. 