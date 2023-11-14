11-14-23 Changes:
I refactored the DB architecture to have one user collection instead of three. I will simply keep the auth state in one field that simplifies the model and updating.
I also refactored the API endpoint naming conventions used to be more inline with RESTful philosophy and to allow for further decoupling of endpoints.
Decided that user auth tokens should be added to user documents in their collection and deleted upon verification
Delved into query vs body params passing to internal API to determine that I should refactor servers/page.tsx to not pass session.access_token via query params but rather body
Determined Jest was the best framework for testing my application given its industry use, open-source, and ease of setup

Issues:
Do we check against discordUserId or userEmail when doing duplicate checks -> if we do userEmail a user could spam submit -> if we do discordUserId then we run the problem of misspelled email
Resolution:
    -> If we check against discordServerId and discordUserId we can overwrite any user (delete it and create a new user with unauthenticated status)

Ideas:
Maybe implement functionality that you can dm the bot to see what servers you are in and then select a server to activate a popup modal that will allow you to submit changes
    -> Potential problems:
        -> Users get good email verified (get approved to enter a discord server) => Then change to bad email
