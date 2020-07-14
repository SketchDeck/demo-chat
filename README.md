# SketchDeck chat demo

Welcome! This is our little test-project, which replicates some aspects of our project chat system.

Currently the codebase runs a basic Firestore backed Angular chat application.

<a href="https://sketchdeck.github.io/demo-chat/">
<img src="https://sketchdeck.github.io/demo-chat/preview.png">
</a>

The goal of this exercise is to add a feature to the chatroom. This will need a bit of backend and frontend code.

This exercise is designed to take 6-10 hours.

## The exercise

The goal is to add <kbd>@mentions</kbd> to our chat. This should look, feel and work just like Slack's version of the feature. They've done a great job of implementing theirs and more or less found the optimal design.

### Technical steps

1. Get the project running by cloning this repository, installing Angular CLI, then running `npm install` and `ng serve`
2. Take `src/assets/users.json` (our mock user data) and write a function to generate a chat handle for each user. FirstnameLastname or their email username are good initial candidates. Note that chat handles do not need to be unique (turns out this is more useful in a real-world application).
3. Create an <a href="https://algolia.com">Algolia</a> account and upload the user data there, with the chat handles.
4. Get type-ahead working in the app, using Algolia as the search engine
5. Build the key handlers to implement the enter auto-complete, arrow up/down selection, and handle user backspace presses as well (e.g. if they delete the @, stop showing the menu)
6. Decide how to post the messages to Firestore
7. Show messages with mentions in them with the mention highlighted

### Specification

Your solution should do the following:

1. When the user types <kbd>@</kbd> in the chat control, pop up a type-ahead pop-up menu showing 7 users they could mention
2. The pop-up should show thumbnail, chat handle, first name, last name
3. As the user types the list is sorted and filtered down to those that have matching names/emails/chat handles
4. If the user presses <kbd>up</kbd> and <kbd>down</kbd> it alters which user is highlighted. When <kbd>enter</kbd> is pressed the highlighted user is entered into the chat text input as <kbd>@chatHandle</kbd>
5. You can decide how you want to store messages with chat handles in Firestore
6. The chat messages in the chat stream should show mentions with a light blue highlight background.

### Bonus points

Here are a few other nice to haves:

- Give each user their own chat bubble colour
- Add an emoji palette
- If a user sends just one emoji, show it big with no background
- Email the mentioned user to let them know who said what to them. You should direct all these emails to your own address.
- Make the text input grow multiline if required

### Working with us

We like to work in a collaborative, communicative manner. We'll invite you to our Slack #tech room. We expect you to:

- Ask us questions to clarify things you're uncertain about
- If you get stuck on something, ask us for help
- Collaborate with us if there's a skill you lack
- Communicate your timeline to us and give realistic estimates of when you'll hit key milestones (e.g. proof of concept, first draft, final version)
- Preview your work (UX / code / demos) early and often so we can provide helpful guidance and know how it's going
- Give a little video-demo to the tech team at the end showing the feature in action and your code


### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
