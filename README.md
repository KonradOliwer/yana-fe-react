# Yet another notes app
___
This is learning project. So take everything with grain of salt and don't emulate things without a thought.

[TODO](#TODO) section is a list of things that would be necessary to do to make a fully functional version of app.

There are 2 backend implementation for this project
- [python+Flask+SQLAlchemy]()
- [go+gin]()


## Using app
### Prerequisites
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

## # TODO

- [ ] Add loging and logout
- [ ] Link user with notes
- [ ] Use toastify to inform user about problem instead of console
- [ ] Handle user changing page without saving data
- [ ] Spinner on loading, block sending multiple requests on double click
- [ ] Save on change with debouncing instead of button click
- [ ] handle name of note too long for sidebar
- [ ] handle changing of renaming note to already used name (currently silently fails)


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