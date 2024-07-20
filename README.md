# Yet another notes app
___
This is learning project. So take everything with grain of salt and don't emulate things without a thought.

There are 4 backend implementation for this project
- [python + Flask + SQLAlchemy](https://github.com/KonradOliwer/yana-be-flask)
- [go + gin](https://github.com/KonradOliwer/yana-be-gin)
- [ruby on rails](https://github.com/KonradOliwer/yana-be-rails)
- [Node.js + NestJS](https://github.com/KonradOliwer/yana-be-nestjs)

Make sure to use same tag version for frontend and backend to ensure compatibility.

## # TODO
This section is a list of functionalities that are required to make it fully functional and usable.

- [ ] Add loging and logout
- [ ] Link user with notes
- [ ] Use toastify to inform user about problem instead of console
- [ ] Handle user changing page without saving data
- [ ] Spinner on loading, block sending multiple requests on double click
- [ ] Save on change with debouncing instead of button click
- [ ] handle name of note too long for sidebar
- [ ] handle changing of renaming note to already used name (currently silently fails)
- [ ] return sorted list of notes from backend

## Functionality
CRUD for taking notes in markdown

## Using app
### Requirements
- [Node.js](https://nodejs.org/en/)
- npm (comes with Node.js)

### Running the app
1. Install dependencies
```bash
npm install
```

2. Run the app
```bash
npm start
```
### Running tests
```bash
npm test
```

## packages.json comment

```json
{
  ...
  "jest": {
    "moduleNameMapper": {
      "^axios$": "axios/dist/node/axios.cjs"
    }
  }
}
```

Is a solution for the problem, about which you can read more here:
https://stackoverflow.com/questions/73958968/cannot-use-import-statement-outside-a-module-with-axios

## Credits

Big thanks for my friend [Mateusz](https://github.com/Mati20041) all the advices and answering all my questions.

Source of icons: https://flowbite.com/icons/